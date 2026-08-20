/**
 * Rex spec scraper.
 *
 * Rex has no static OpenAPI document. Instead it self-describes through
 * introspection endpoints:
 *
 *   - `{Service}::describe`      (with `include_detail: true`) — every method,
 *     its typed parameters, and a per-method `openapi` block containing a
 *     request schema and embedded response examples.
 *   - `{Service}::describeModel` — the search/query surface: searchable
 *     fields, orderby fields, result formats, delete modes.
 *   - `ApiDocs::getAvailableServices` — the catalog of all ~272 services.
 *
 * This script logs in, pulls those documents for the services listed in
 * `SERVICES`, and writes them to `specs/rex/`. `build-openapi.ts` then
 * transforms them into a standard OpenAPI 3.1 document.
 *
 * Auth: set `REX_API_TOKEN`, or `REX_EMAIL` + `REX_PASSWORD`. Also set
 * `REX_APP_IDENTIFIER` (`Integration:Company:Service`).
 *
 * Usage:
 *   bun run scripts/scrape-specs.ts
 */
import * as fs from "fs";
import * as path from "path";

const API_BASE_URL =
  process.env.REX_API_BASE_URL ?? "https://api.rexsoftware.com";

// Rex mandates an X-App-Identifier on every request; like the SDK proper,
// there is deliberately no fallback value.
function appIdentifier(): string {
  const value = process.env.REX_APP_IDENTIFIER;
  if (!value) {
    throw new Error(
      'Set REX_APP_IDENTIFIER ("Integration:Company:Service") to identify this integration to Rex.',
    );
  }
  return value;
}

/** Services to scrape. Extend this list to add more Rex models. */
const SERVICES = [
  "Listings",
  "Properties",
  "AdminWebhooks",
  "Feedback",
  "Contacts",
  // The activity write-back surface. Rex has no actor field on a Note, so
  // the salesperson's name goes in the body — but a Note is the only way a
  // non-listing prospecting call reaches the CRM at all, Feedback being
  // listing-bound. Generated rather than hand-modelled because Notes ships a
  // full `openapi` block, so the types are real.
  "Notes",
  // The only route to `enquiry_source`, whose valuelist is declared
  // `source: "remote"` — its permitted values are per-account and exist
  // nowhere in the spec, so they can only be read at runtime.
  "AdminValueLists",
] as const;

const rootDir = path.join(import.meta.dir, "..");
const outDir = path.join(rootDir, "specs", "rex");

interface RexEnvelope<T> {
  result: T | null;
  error: { message?: string; type?: string } | null;
}

async function rexCall<T>(
  method: string,
  body: Record<string, unknown>,
  token?: string,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/v1/rex/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-App-Identifier": appIdentifier(),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as RexEnvelope<T>;
  if (!res.ok || json.error || json.result === null) {
    throw new Error(
      `${method} failed (HTTP ${res.status}): ${json.error?.message ?? "unknown error"}`,
    );
  }
  return json.result;
}

async function resolveToken(): Promise<string> {
  if (process.env.REX_API_TOKEN) return process.env.REX_API_TOKEN;

  const email = process.env.REX_EMAIL;
  const password = process.env.REX_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "Set REX_API_TOKEN, or REX_EMAIL + REX_PASSWORD, to scrape Rex specs.",
    );
  }
  const res = await fetch(`${API_BASE_URL}/v1/rex/Authentication/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-App-Identifier": appIdentifier(),
    },
    body: JSON.stringify({ email, password }),
  });
  const json = (await res.json()) as RexEnvelope<string>;
  if (!res.ok || json.error || typeof json.result !== "string") {
    throw new Error(
      `Rex login failed (HTTP ${res.status}): ${json.error?.message ?? "unknown error"}`,
    );
  }
  return json.result;
}

function write(name: string, data: unknown): void {
  const file = path.join(outDir, name);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`  wrote ${path.relative(rootDir, file)}`);
}

async function main(): Promise<void> {
  fs.mkdirSync(outDir, { recursive: true });
  const token = await resolveToken();
  console.log("✓ authenticated");

  // Catalog of all services — the manifest for which models exist.
  const catalog = await rexCall<unknown>(
    "ApiDocs::getAvailableServices",
    {},
    token,
  );
  write("_catalog.json", { result: catalog });

  for (const service of SERVICES) {
    console.log(`scraping ${service}...`);
    const describe = await rexCall<unknown>(
      `${service}::describe`,
      { include_detail: true },
      token,
    );
    write(`${service}.describe.json`, { result: describe });

    // Only Rex's *model* services expose `describeModel`; utility services
    // like AdminValueLists answer 405. A missing query surface is a fact
    // about the service, not a scrape failure.
    let describeModel: unknown;
    try {
      describeModel = await rexCall<unknown>(
        `${service}::describeModel`,
        {},
        token,
      );
    } catch {
      console.log(`  no describeModel (not a searchable model) — skipping`);
      continue;
    }
    write(`${service}.describeModel.json`, { result: describeModel });
  }

  console.log(
    `\n✓ scraped ${SERVICES.length} service(s) to ${path.relative(rootDir, outDir)}`,
  );
}

main().catch((err) => {
  console.error(`\n✗ ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
