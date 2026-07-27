import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ListingsIsGhostSessionInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({}).pipe(
    T.Http({ method: "POST", path: "/v1/rex/Listings::isGhostSession" }),
  );
export type ListingsIsGhostSessionInput =
  typeof ListingsIsGhostSessionInput.Type;

// Output Schema
export const ListingsIsGhostSessionOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ListingsIsGhostSessionOutput =
  typeof ListingsIsGhostSessionOutput.Type;

// The operation
/**
 * True when the current session is a "ghost" account-user — i.e. a group-app /
head-office user who logged into this (child) account via switchToAccount
rather than being a real member of it. This is a session-TYPE predicate, NOT
an authorisation check: a ghost account_users row is only ever created once
the user's group-app visibility privilege (login_to_sub_accounts on a parent,
or an account-group privilege-set assignment) has been enforced upstream at
token creation, so a ghost session is proof that privilege already held — do
not treat this as a substitute for a privilege check. Used to grant such users
seat-free access to AI Prospecting (CRM-13865).
 *
 * True when the current session is a "ghost" account-user — i.e. a group-app /
 * head-office user who logged into this (child) account via switchToAccount
 * rather than being a real member of it. This is a session-TYPE predicate, NOT
 * an authorisation check: a ghost account_users row is only ever created once
 * the user's group-app visibility privilege (login_to_sub_accounts on a parent,
 * or an account-group privilege-set assignment) has been enforced upstream at
 * token creation, so a ghost session is proof that privilege already held — do
 * not treat this as a substitute for a privilege check. Used to grant such users
 * seat-free access to AI Prospecting (CRM-13865).
 */
export const ListingsIsGhostSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: ListingsIsGhostSessionInput,
    outputSchema: ListingsIsGhostSessionOutput,
  }),
);
