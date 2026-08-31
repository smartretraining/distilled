#!/usr/bin/env bun
/**
 * fetch-spec — re-download the VaultRE OpenAPI document.
 *
 * Input:  https://docs.api.vaultre.com.au/swagger/vaultre.yaml
 * Output: specs/vaultre.yaml  (committed verbatim; `scripts/convert.ts` reads it)
 *
 * The document is public — no API key, no integrator agreement — and the
 * Swagger UI at docs.api.vaultre.com.au/swagger/index.html loads this exact
 * URL. It is stored byte-for-byte so that re-running this script produces a
 * diff that IS the vendor's change; anything we decide about the document is
 * expressed in `convert.ts` or in `patches/`, never by editing it here.
 *
 * VaultRE publishes no changelog feed for the spec, so this is the only way
 * to see drift. Run it, read the diff, then regenerate.
 *
 * Usage: bun run specs:fetch
 */
import { readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";

const SPEC_URL = "https://docs.api.vaultre.com.au/swagger/vaultre.yaml";
const target = path.resolve(import.meta.dir, "../specs/vaultre.yaml");

const response = await fetch(SPEC_URL);
if (!response.ok) {
  throw new Error(
    `${SPEC_URL} → HTTP ${response.status} ${response.statusText}`,
  );
}
const next = await response.text();

const previous = await readFile(target, "utf8").catch(() => undefined);
if (previous === next) {
  console.log(`✅ specs/vaultre.yaml is current (${next.length} bytes)`);
} else {
  await writeFile(target, next);
  console.log(
    previous === undefined
      ? `✅ wrote specs/vaultre.yaml (${next.length} bytes)`
      : `⚠️  specs/vaultre.yaml CHANGED (${previous.length} → ${next.length} bytes) — read the diff before regenerating`,
  );
}
