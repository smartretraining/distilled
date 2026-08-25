#!/usr/bin/env bun
/**
 * build-spec — assemble an OpenAPI 3.0 document for the Box+Dice AI API.
 *
 * Box+Dice publishes no OpenAPI document. Its docs are API Blueprint
 * (`specs/boxdice-ai.apib`, mirrored from
 * https://boxdiceaiapi.docs.apiary.io/api-description-document), which is
 * Markdown: prose attribute lists plus JSON examples. This script is the
 * blueprint transcribed into a spec the converter can consume.
 *
 * Input:  specs/boxdice-ai.apib  (reference only — NOT parsed; see below)
 * Output: specs/openapi.json     (consumed by scripts/convert.ts)
 *
 * WHY TRANSCRIBED RATHER THAN PARSED. The blueprint's structure is sound but
 * its examples are not: `sale_price` is documented `(Number)` and sent as
 * `"431000.0"`, `auctioneer_id` is documented `(Number)` and shown holding a
 * date, a deduction's `fixed_price` is documented `(Number)` and shown as
 * `false`, and two request bodies have unterminated JSON keys
 * (`"contact_category:`). A parser would faithfully reproduce every one of
 * those. Transcribing lets each conflict be resolved deliberately and
 * recorded — see {@link unresolved} and the UNRESOLVED list in README.md.
 *
 * CONFIDENCE. Request side: high — parameters, path shapes and body wrappers
 * are stated plainly and consistently. Response side: MEDIUM AT BEST. Nothing
 * here has been checked against a live tenant, because we have no API key. The
 * design rule throughout is therefore: WHEN IN DOUBT, WIDEN. Every response
 * member is optional and nullable, no response enum is closed, and outright
 * type contradictions become `unknown` rather than a guess. A schema that
 * decodes a superset of reality is recoverable; one that rejects a real
 * payload is an outage.
 *
 * WHEN A KEY ARRIVES. Add `scripts/capture-samples.ts` (copy Reapit's — it
 * records response STRUCTURE only, no values, so its output is safe to
 * commit), then merge `specs/observed.json` over RESPONSES below. The request
 * side should survive untouched. Every `unresolved()` call is a question for
 * that pass to answer.
 */
import { writeFile } from "node:fs/promises";
import * as path from "node:path";

const root = path.resolve(import.meta.dir, "..");

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = any;

// ============================================================================
// Schema helpers
// ============================================================================

/**
 * Every response member is nullable. The blueprint's own examples send
 * `"unit": null`, `"type": null` and `"category": null` on records whose
 * attribute lists declare plain `(String)`, and a tombstoned contact
 * (`{ "id": 7, "status": "deleted" }`) omits everything else — so
 * non-nullability is not a property this API has.
 */
const str = (description?: string): Json => ({
  type: "string",
  nullable: true,
  ...(description ? { description } : {}),
});
const int = (description?: string): Json => ({
  type: "integer",
  nullable: true,
  ...(description ? { description } : {}),
});
const num = (description?: string): Json => ({
  type: "number",
  nullable: true,
  ...(description ? { description } : {}),
});
const bool = (description?: string): Json => ({
  type: "boolean",
  nullable: true,
  ...(description ? { description } : {}),
});

/** ISO 8601 timestamp. `format` is documentation — the converter ignores it. */
const ts = (description?: string): Json => ({
  type: "string",
  nullable: true,
  format: "date-time",
  ...(description ? { description } : {}),
});

/** `YYYY-MM-DD`. Also carried as a string; see {@link ts}. */
const date = (description?: string): Json => ({
  type: "string",
  nullable: true,
  format: "date",
  ...(description ? { description } : {}),
});

const arrayOf = (items: Json, description?: string): Json => ({
  type: "array",
  nullable: true,
  items,
  ...(description ? { description } : {}),
});

const ref = (name: string): Json => ({ $ref: `#/components/schemas/${name}` });

/**
 * A member whose wire type the blueprint contradicts itself about. Emits a
 * schema with no `type`, which the converter maps to `Document` — i.e.
 * `unknown` on the TypeScript surface.
 *
 * This is deliberate and it is the single most important decision in this
 * file. `sale_price` is the case that proves it: the attribute list says
 * `(Number)`, the example sends the string `"431000.0"`. Picking either one
 * makes the generated schema reject half the possible realities, and a
 * failed decode takes down a sync run. `unknown` forces the caller to narrow
 * at the point of use, which is honest about what we actually know.
 *
 * Each call names the conflict. Resolving them against real payloads is the
 * first job of the capture pass.
 */
const unresolved = (conflict: string): Json => ({
  description: `UNRESOLVED: ${conflict} Typed as unknown until confirmed against a live response.`,
});

/** An object schema. Every member optional — see {@link str}. */
const object = (
  properties: Record<string, Json>,
  description?: string,
): Json => ({
  type: "object",
  properties,
  ...(description ? { description } : {}),
});

// ============================================================================
// Component schemas
// ============================================================================

/**
 * Enumerated values are recorded in `description`, never as `enum`.
 *
 * The blueprint lists 22 contact-activity types and a dozen listing statuses,
 * and those lists were accurate the day they were written. A closed `enum`
 * turns Box+Dice adding a 23rd into a decode failure on our side, for a value
 * we would otherwise pass through harmlessly. The documented values are worth
 * keeping as guidance; they are not worth enforcing.
 */
const CONTACT_ACTIVITY_TYPES =
  "BUYER_CLOSED, BUYER_IN, BUYER_MAYBE, BUYER_OUT, OWNER, PAST_OWNER, " +
  "PROS_LANDLORD_APP, PROS_LANDLORD_CAN, PROS_LANDLORD_LISTED, " +
  "PROS_VENDOR_APP, PROS_VENDOR_CAN, PROS_VENDOR_LISTED, PROS_VENDOR_PRE, " +
  "PURCHASED, PURCHASER, PURCHASER_CANCELLED, SOLD_BY_OTHER, VENDOR, " +
  "VENDOR_CANCELLED, VENDOR_SETTLED, VENDOR_SOLD. The /contact_activity_types " +
  "endpoint also returns BUYER_ENQUIRY, which this list omits — read it from " +
  "there rather than hard-coding.";

const SCHEMAS: Record<string, Json> = {
  Paging: object(
    {
      next: str(
        "Absolute URL for the next request, carrying the `after` cursor. " +
          "Note the API echoes whichever partner path the tenant was " +
          "provisioned under — the blueprint's own examples show " +
          "/ai_api/, /aire_api/ and /rebot_api/ — so read the `after` " +
          "query parameter out of this URL rather than requesting it verbatim.",
      ),
    },
    "Cursor block returned by every paginated collection.",
  ),

  Address: object({
    id: int("Property ID — the address IS a property record."),
    unit: str(),
    number: str(),
    street_name: str(),
    street_type: str(),
    suburb: str(),
    postcode: str(),
    state: str(),
    country: str(),
    latitude: num(),
    longitude: num(),
  }),

  Property: object({
    id: int(),
    type: str(),
    category: str(),
    unit: str(),
    number: str(),
    street_name: str(),
    street_type: str(),
    suburb: str(),
    postcode: str(),
    state: str(),
    country: str(),
    latitude: num(),
    longitude: num(),
    beds: int(),
    baths: int(),
    cars: int(),
    rates: str(),
    water_rates: str(),
    created_at: ts(),
    updated_at: ts(),
  }),

  ContactCategory: object({
    id: int(),
    type_id: int(),
    consultant_id: int(),
    name: str(),
  }),

  ContactNote: object({
    id: int(),
    consultant_id: int(),
    text: str(),
  }),

  CriteriaSuburb: object({
    name: str(),
    postcode: str(),
    state: str(),
  }),

  Criteria: object(
    {
      id: int(),
      type: str("`sales` or `rental`."),
      suburbs: arrayOf(ref("CriteriaSuburb")),
      property_type_ids: arrayOf(int()),
      property_category_ids: arrayOf(int()),
      beds_from: int(),
      beds_to: int(),
      baths: int(),
      rooms: int(),
      cars: int(),
      price_from: num(),
      price_to: num(),
      house_size_from: num(),
      house_size_to: num(),
      house_measure: str("`Square(s)` or `Sqm`."),
      land_size_from: num(),
      land_size_to: num(),
      land_measure: str("`Acre(s)`, `Hectare(s)`, `Square(s)` or `Sqm`."),
      return_pa_from: num(),
      return_pa_to: num(),
      notes: str(),
      created_at: ts(),
      updated_at: ts(),
    },
    "Buying criteria. The blueprint documents this shape twice — once " +
      "embedded in Contact, once under Search Criteria — and the two lists " +
      "differ. This is their union; every member is optional, so neither " +
      "reading is excluded.",
  ),

  Contact: object(
    {
      id: int(),
      consultant_id: int("The `My contact` category consultant."),
      status: str(
        "Present ONLY on tombstones: a deleted contact arrives as " +
          '`{ id, status: "deleted" }` with every other member absent. ' +
          "A sync consumer must branch on this before reading anything else.",
      ),
      deceased: bool(),
      permit_email: bool(),
      permit_email_blast: bool(),
      permit_sms: bool(),
      first_name: str(),
      last_name: str(),
      salutation: str(),
      attention: str(),
      legal_name: str(),
      phone_bh: str(),
      phone_ah: str(),
      mobile: str(),
      email: str(),
      company: bool(),
      created_at: ts(),
      address: ref("Address"),
      categories: arrayOf(ref("ContactCategory")),
      notes: arrayOf(ref("ContactNote")),
      criteria: arrayOf(ref("Criteria")),
    },
    "A contact. Also used for the per-consultant contact list, which returns " +
      "the same shape.",
  ),

  Consultant: object({
    id: int(),
    active: bool(
      "Documented as the attribute; the example instead sends `status`. " +
        "Both are modelled — expect one of them.",
    ),
    status: str('See `active`. Observed value: `"active"`.'),
    first_name: str(),
    last_name: str(),
    mobile: str(),
    email: str(),
    office_id: int(),
    photo_url: str(),
  }),

  ContactActivity: object({
    id: int(),
    contact_id: int(),
    consultant_id: int(),
    sales_listing_id: int(),
    property_id: int(),
    created_at: ts(),
    type: str(CONTACT_ACTIVITY_TYPES),
  }),

  ContactActivityType: object({
    id: int(),
    key: str("e.g. `BUYER_IN`."),
    value: str("Display label, e.g. `Buyer - In`."),
  }),

  ContactCategoryType: object({ id: int(), name: str() }),
  PropertyType: object({ id: int(), name: str() }),
  PropertyCategory: object({ id: int(), type_id: int(), name: str() }),
  Office: object({ id: int(), name: str() }),

  Task: object(
    {
      id: int(),
      subject: str(),
      task_type: str(),
      task_date: date(),
      consultant_id: int(),
      contact_ids: arrayOf(int()),
      notes: str(),
      complete_date: ts("Completed tasks only."),
      created_at: ts(),
      updated_at: ts(),
    },
    "A task. The completed-tasks endpoint returns the same shape plus " +
      "`complete_date`; the union is modelled here.",
  ),

  Appointment: object({
    id: int(),
    subject: str(),
    contact_id: int(),
    consultant_ids: arrayOf(int()),
    starts_at: ts(),
    ends_at: ts(),
    created_at: ts(),
    updated_at: ts(),
  }),

  BuyerNote: object({
    id: int(),
    consultant_id: int(),
    contact_id: int(),
    comment: str(),
    created_at: ts(),
  }),

  Email: object({
    id: int(),
    from: str("Display form, e.g. `Jane Doe <jane@example.com>`."),
    to: str(),
    consultant_id: int(),
    contact_id: int(),
    comment: str("The subject line, despite the member name."),
    created_at: ts(),
  }),

  SmsMessage: object({
    id: int(),
    consultant_id: int(),
    contact_id: int(),
    comment: str("The message body."),
    status: str("Observed value: `COMPLETED`."),
    created_at: ts(),
  }),

  Inspection: object({
    inspection_date: date(),
    start_time: str("`HH:MM`."),
    end_time: str("`HH:MM`."),
  }),

  AdvertisingCopy: object({ heading: str(), text: str() }),

  CommissionStructure: object({
    percentage: num(),
    amount: num(),
    target: num(),
  }),

  GrossCommission: object({ inc_gst: num(), ex_gst: num() }),

  VoucherDeductions: object({
    deductions_on_gross_total: num(),
    deductions_on_subtotal_total: num(),
    commission_after_deductions_on_gross: num(),
    commission_after_deductions: num(),
  }),

  CommissionTarget: object({
    id: int(),
    target: num(),
    list: num(),
    manage: num(),
    sell: num(),
    type: str(),
  }),

  CommissionConsultant: object({
    id: int(),
    commission_split_type: str("e.g. `simple_target`."),
    commission_split_date_from: str(),
    commission_split_date_to: str(),
    cumulative_commission_introduced: str(
      'Documented and observed as a STRING (`"0.0"`), not a number.',
    ),
    commission_targets: arrayOf(ref("CommissionTarget")),
  }),

  CommissionDeduction: object({
    id: int(),
    name: str("Present in the example, absent from the attribute list."),
    description: str(),
    office_commission_id: int(),
    svoucher_commission_id: int(),
    reasonid_fk: int(),
    fixed_price: unresolved(
      "Documented `(Number)`, sent as `false` in the example — the name " +
        "reads like a flag and the value agrees, but the attribute list does not.",
    ),
    campaign_item_id: int(),
    criteria: str("Observed value: `AFTER`."),
    amount: num("Present in the example, absent from the attribute list."),
    percentage: num("Present in the example, absent from the attribute list."),
  }),

  ConsultantCommission: object({
    id: int(),
    role: str("Observed values: `LIST`, and by implication `SELL`."),
    consultant_id: int(),
    comm_intro_at: ts(),
    comm_intro_amount: str("Documented and observed as a STRING."),
    comm_intro_percentage: num(),
    prop_value_amount: num(),
    prop_value_percentage: num(),
    autopopulated_with: int(),
    name: str("Consultant's display name."),
    office_id: int(),
    percentage: num(),
    amount: num(),
    image_url: str(),
    consultant: ref("CommissionConsultant"),
    deductions: arrayOf(ref("CommissionDeduction")),
  }),

  OfficeCommission: object({
    id: int(),
    office_id: int(),
    percentage: num(),
    amount: num(),
    deductions: arrayOf(ref("CommissionDeduction")),
  }),

  CommissionPaymentMilestone: object({
    id: int(),
    stage_type: str("Observed value: `DEPOSIT_RELEASE`."),
    description: str(),
    percentage: num(),
    amount: num(),
    consultant_commissions: arrayOf(ref("ConsultantCommission")),
    office_commissions: arrayOf(ref("OfficeCommission")),
  }),

  Voucher: object(
    {
      sale_date: date(),
      sale_price: unresolved(
        'Documented `(Number)`, sent as the string `"431000.0"`.',
      ),
      settlement_date: date(),
      commission_type: str("Observed value: `tiered`."),
      commission_structures: arrayOf(ref("CommissionStructure")),
      gross_commission: ref("GrossCommission"),
      deductions: ref("VoucherDeductions"),
      multiple_payment_stages: bool(),
      commission_payment_milestones: arrayOf(ref("CommissionPaymentMilestone")),
    },
    "The sale and its commission breakdown. This is the richest thing the " +
      "API exposes and has no equivalent in VaultRE: gross commission, " +
      "deductions, payment milestones, and per-consultant splits with targets.",
  ),

  BuyerComment: object({
    id: int(),
    consultant_id: int(),
    text: str(),
    type: str("Observed value: `EMAIL`."),
    created_at: ts(),
    updated_at: ts(),
  }),

  ListingBuyer: object({
    contact_id: int(),
    interest_level: str("Observed value: `MAYBE`."),
    source: str("Observed value: `REA Lead`."),
    enquiry_date: ts(),
    comments: arrayOf(ref("BuyerComment")),
  }),

  ListingFile: object(
    { id: int(), name: str(), description: str(), url: str() },
    "Public-flagged files only. `url` carries a single-use-looking token " +
      "query parameter; treat it as short-lived rather than storing it.",
  ),

  SalesListing: object({
    id: int(),
    status: str(
      "Observed: `settled`. Related activity types imply `VENDOR_SOLD`, " +
        "`VENDOR_SETTLED`, `SOLD_BY_OTHER` and cancellations elsewhere in " +
        "the lifecycle; the blueprint never enumerates listing status itself.",
    ),
    consultant_ids: arrayOf(int()),
    office_id: int(),
    primary_consultant_id: int(),
    listing_type: str("Observed: `PRIVATE SALE`."),
    hidden: bool(),
    price_undisclosed: bool(),
    address_undisclosed: bool(),
    suburb_undisclosed: bool(),
    under_offer: bool(),
    description: str(),
    url: str(),
    price_from: num(),
    price_to: num(),
    display_price: str(),
    listing_image_url: str(),
    listed_date: date(),
    auction_date: date(),
    auctioneer_id: int(
      "Documented `(Number)`; the example holds a date, which is a " +
        "copy-paste of `auction_date` rather than a second type. Modelled " +
        "per the documentation — confirm on capture.",
    ),
    property: ref("Property"),
    advertising_copy: ref("AdvertisingCopy"),
    inspections: arrayOf(ref("Inspection")),
    voucher: ref("Voucher"),
    buyers: arrayOf(ref("ListingBuyer")),
    vendor_ids: arrayOf(int()),
    purchaser_ids: arrayOf(int()),
    files: arrayOf(ref("ListingFile")),
    vendor_solicitor_contact_id: int(),
    purchaser_solicitor_contact_id: int(),
    campaign_amount: num(),
    expected_settlement_date: ts(),
    actual_release_date: ts(),
  }),

  RentalListing: object({
    id: int(),
    status: str("Observed: `LEASED`."),
    consultant_ids: arrayOf(int()),
    rental_type: str("Observed: `RENTAL`."),
    primary_consultant_id: int(),
    price_undisclosed: bool(),
    address_undisclosed: bool(),
    url: str(),
    price_from: num(),
    price_to: num(),
    price_period: str("Observed: `WEEK`."),
    display_price: str(),
    listing_image_url: str(),
    property: ref("Property"),
    advertising_copy: ref("AdvertisingCopy"),
    inspections: arrayOf(ref("Inspection")),
  }),

  Appraisal: object({
    id: int(),
    appraisal_status: str("`current`, `cancelled` or `listed`."),
    office_id: int(),
    property_id: int(),
    primary_consultant_id: int(),
    appraisal_source: str(),
    appraisal_consultant_ids: arrayOf(int()),
    contact_ids: arrayOf(int()),
    price_from: num(),
    price_to: num(),
    sale_date: date(),
    withdrawn_date: date(),
    created_at: ts(),
    updated_at: ts(),
  }),

  InspectionDetails: object({
    id: int(),
    inspection_date: date(),
    start_time: str(),
    end_time: str(),
    sales_listing_id: int(),
  }),

  InspectionAttendanceComment: object({
    id: int(),
    comment: str(),
    consultant_id: int(),
    created_at: ts(),
  }),

  InspectionAttendance: object({
    id: int(),
    contact_id: int(),
    inspection_details: ref("InspectionDetails"),
    comments: arrayOf(ref("InspectionAttendanceComment")),
  }),

  AppraisalLead: object({
    id: int(),
    temperature: str("`hot`, `warm` or `cold`."),
    status: str("`open` or `closed`."),
    action: str("e.g. `Appraisal created`, `Task created`, `Property listed`."),
    task: bool(),
    task_created_on: ts(),
    appraisal: bool(),
    appraisal_status: str(),
    listing: bool(),
    listing_status: str(),
  }),

  /** `{ "id": 7352 }` — the shape every bare create returns. */
  CreatedId: object({ id: int() }),

  /** `{}` — deletes and the contact PATCH return an empty object. */
  Empty: object({}),

  LeadAddress: object(
    {
      unit: int("Documented `(Number)`, unlike the read side's `(String)`."),
      number: int("Documented `(Number)`, unlike the read side's `(String)`."),
      street_name: str(),
      street_type: str(),
      suburb: str(),
      postcode: int(
        "Documented `(Number)`, unlike the read side's `(String)`.",
      ),
      state: str(),
      country: str(),
    },
    "Address as accepted when creating a lead flow lead — used only when " +
      "`property_id` is unknown. The blueprint types unit/number/postcode as " +
      "numbers here and as strings everywhere on the read side; both are " +
      "transcribed as documented rather than reconciled.",
  ),
};

// ============================================================================
// Operation helpers
// ============================================================================

/**
 * The `after` cursor. Opaque on most endpoints (`"1520452907_37"` — a
 * timestamp and record id), but a plain page number on the email and SMS
 * history endpoints. `src/pagination.ts` reads it back out of `paging.next`
 * either way, so the difference never reaches a caller.
 */
const afterParam: Json = {
  name: "after",
  in: "query",
  required: false,
  description:
    "Paging cursor from the previous response's `paging.next` URL. Omit for " +
    "the first page (oldest records first).",
  schema: { type: "string" },
};

const pathParam = (name: string, description: string): Json => ({
  name,
  in: "path",
  required: true,
  description,
  schema: { type: "integer" },
});

const jsonBody = (schema: Json, required = true): Json => ({
  required,
  content: { "application/json": { schema } },
});

const jsonResponse = (description: string, schema: Json): Json => ({
  description,
  content: { "application/json": { schema } },
});

/**
 * A paginated collection response.
 *
 * `data` and `paging` are declared optional, but note that core RE-REQUIRES
 * `data` on paginated operations (it promotes the pagination items member so
 * `.items` always has something to read). The empty body Box+Dice returns with
 * its end-of-feed 204 therefore cannot decode on its own — `src/protocol.ts`
 * substitutes an empty page before decode. Do not "fix" that by making `data`
 * required here; the optionality is what keeps the non-paginated collections
 * (`searchContacts`, `listContactOwnedProperties`) honest about returning
 * nothing.
 */
const collection = (schemaName: string, description: string): Json =>
  jsonResponse(
    description,
    object({ data: arrayOf(ref(schemaName)), paging: ref("Paging") }),
  );

/** A non-paginated `{ data: [...] }` response. */
const bareCollection = (schemaName: string, description: string): Json =>
  jsonResponse(description, object({ data: arrayOf(ref(schemaName)) }));

/** The shared 400. 401/429/5xx are handled by the protocol, not per-op. */
const badRequest: Json = jsonResponse(
  "Request is invalid. The body carries `error` (a string) or `errors` (a " +
    "field → messages map); `src/protocol.ts` normalises both.",
  object({ error: str(), errors: { type: "object", nullable: true } }),
);

/** GET a paginated collection. */
const listOp = (o: {
  operationId: string;
  summary: string;
  schema: string;
  tag: string;
  params?: Json[];
}): Json => ({
  operationId: o.operationId,
  summary: o.summary,
  tags: [o.tag],
  parameters: [...(o.params ?? []), afterParam],
  responses: {
    "200": collection(o.schema, o.summary),
    "204": {
      description:
        "No records newer than the cursor. The body is empty; the caller " +
        "should wait `Retry-After` seconds and re-request the same URL.",
    },
  },
});

// ============================================================================
// Paths
// ============================================================================

const contactId = pathParam("contact_id", "Contact ID");

const PATHS: Record<string, Json> = {
  "/appraisal_leads": {
    get: listOp({
      operationId: "listAppraisalLeads",
      summary: "List appraisal leads sourced from this integration.",
      schema: "AppraisalLead",
      tag: "AppraisalLeads",
    }),
    post: {
      operationId: "createAppraisalLead",
      summary: "Create a sales appraisal or rental BDM lead.",
      description:
        "Idempotent-ish: no new lead is created when an open one already " +
        "exists for the same contact, property and listing type. When the " +
        "lead consultant does not have the Lead Flow module enabled this " +
        "creates a TASK instead — the response `id` is a task id in that " +
        "case, and nothing in the response says which.",
      tags: ["AppraisalLeads"],
      requestBody: jsonBody(
        object({
          appraisal_lead: object({
            consultant_id: int(),
            contact_id: int(),
            property_id: int("Must be a property owned by the contact."),
            address: ref("LeadAddress"),
            listing_type: str("`sales` (default) or `rental`."),
            temperature: str("`hot`, `warm` or `cold`."),
            subject: str("Task subject. Defaults to `New AI Lead`."),
            task_date: date("Task due date. Defaults to today."),
            comment: str(),
          }),
        }),
      ),
      responses: {
        "200": jsonResponse("Lead (or task) created.", ref("CreatedId")),
        "400": badRequest,
      },
    },
  },

  "/consultants": {
    get: listOp({
      operationId: "listConsultants",
      summary: "List consultants.",
      schema: "Consultant",
      tag: "Consultants",
    }),
  },

  "/consultants/{consultant_id}/contacts": {
    get: listOp({
      operationId: "listConsultantContacts",
      summary: "List contacts belonging to a consultant.",
      schema: "Contact",
      tag: "Consultants",
      params: [pathParam("consultant_id", "Consultant ID")],
    }),
  },

  "/contacts": {
    get: listOp({
      operationId: "listContacts",
      summary: "List contacts.",
      schema: "Contact",
      tag: "Contacts",
    }),
    post: {
      operationId: "createContact",
      summary: "Create a contact.",
      tags: ["Contacts"],
      requestBody: jsonBody(
        object({
          contact: object({
            first_name: str(),
            last_name: str(),
            salutation: str(),
            attention: str(),
            legal_name: str(),
            mobile: str(),
            phone_bh: str(),
            phone_ah: str(),
            email: str(),
            company: bool(),
            deceased: bool(),
            permit_email: bool(),
            permit_email_blast: bool(),
            permit_sms: bool(),
            consultant_id: int("Consultant recorded as the contact's creator."),
            address: ref("Address"),
          }),
        }),
      ),
      responses: {
        "201": jsonResponse("Contact created.", ref("CreatedId")),
        "400": badRequest,
      },
    },
  },

  "/contacts/search": {
    get: {
      operationId: "searchContacts",
      summary: "Search contacts by email or mobile.",
      description:
        "Searches only the offices the API key is permitted for. Passing " +
        "both parameters ORs them — it does not narrow the result.",
      tags: ["Contacts"],
      parameters: [
        {
          name: "email",
          in: "query",
          required: false,
          schema: { type: "string" },
        },
        {
          name: "mobile",
          in: "query",
          required: false,
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": bareCollection("Contact", "Matching contacts."),
        "204": { description: "No contact matched." },
      },
    },
  },

  "/contacts/{id}": {
    get: {
      operationId: "getContact",
      summary: "Get a contact.",
      tags: ["Contacts"],
      parameters: [pathParam("id", "Contact ID")],
      responses: {
        "200": jsonResponse("The contact.", ref("Contact")),
      },
    },
    patch: {
      operationId: "updateContact",
      summary: "Update contact details and contact permissions.",
      tags: ["Contacts"],
      parameters: [pathParam("id", "Contact ID")],
      requestBody: jsonBody(
        object({
          contact: object({
            first_name: str(),
            last_name: str(),
            salutation: str(),
            attention: str(),
            legal_name: str(),
            mobile: str(),
            phone_bh: str(),
            phone_ah: str(),
            email: str(),
            deceased: bool(),
            permit_email: bool(),
            permit_email_blast: bool(),
            permit_sms: bool(),
            address: ref("Address"),
          }),
        }),
      ),
      responses: {
        "200": jsonResponse("Updated. The body is `{}`.", ref("Empty")),
        "400": badRequest,
      },
    },
  },

  "/contacts/{id}/buyer_notes": {
    get: listOp({
      operationId: "listContactBuyerNotes",
      summary: "List a contact's buyer notes.",
      schema: "BuyerNote",
      tag: "Contacts",
      params: [pathParam("id", "Contact ID")],
    }),
  },

  "/contacts/{id}/email_history": {
    get: listOp({
      operationId: "listContactEmailHistory",
      summary: "List emails sent to a contact.",
      schema: "Email",
      tag: "Contacts",
      params: [pathParam("id", "Contact ID")],
    }),
  },

  "/contacts/{id}/sms_history": {
    get: listOp({
      operationId: "listContactSmsHistory",
      summary: "List SMS messages sent to a contact.",
      schema: "SmsMessage",
      tag: "Contacts",
      params: [pathParam("id", "Contact ID")],
    }),
  },

  "/contacts/{id}/owned_properties": {
    get: {
      operationId: "listContactOwnedProperties",
      summary: "List properties owned by a contact.",
      tags: ["Contacts"],
      parameters: [pathParam("id", "Contact ID")],
      responses: {
        "200": bareCollection("Property", "The contact's owned properties."),
        "204": { description: "The contact owns no properties." },
      },
    },
  },

  "/contact_activities": {
    get: listOp({
      operationId: "listContactActivities",
      summary: "List contact activities.",
      schema: "ContactActivity",
      tag: "ContactActivities",
    }),
  },

  "/contacts/{contact_id}/contact_activities": {
    get: listOp({
      operationId: "listContactActivitiesForContact",
      summary: "List one contact's activities.",
      schema: "ContactActivity",
      tag: "ContactActivities",
      params: [contactId],
    }),
  },

  "/contacts/{contact_id}/categories": {
    post: {
      operationId: "createContactCategory",
      summary: "Assign a category to a contact.",
      description:
        "Supply `type_id` or `name`. An unknown `name` CREATES a new category " +
        "type in the consultant's office group — a typo becomes a permanent " +
        "category, so prefer `type_id` from listContactCategoryTypes.",
      tags: ["ContactCategories"],
      parameters: [contactId],
      requestBody: jsonBody(
        object({
          contact_category: object({
            type_id: int("Required unless `name` is given."),
            name: str(
              "Required unless `type_id` is given. Max 100 characters.",
            ),
            consultant_id: int(),
          }),
        }),
      ),
      responses: {
        "201": jsonResponse("Category assigned.", ref("CreatedId")),
        "400": badRequest,
      },
    },
  },

  "/contacts/{contact_id}/categories/{id}": {
    delete: {
      operationId: "deleteContactCategory",
      summary: "Remove a category from a contact by category id.",
      tags: ["ContactCategories"],
      parameters: [contactId, pathParam("id", "Contact category ID")],
      responses: {
        "200": jsonResponse("Removed. The body is `{}`.", ref("Empty")),
      },
    },
  },

  "/contacts/{contact_id}/category": {
    delete: {
      operationId: "deleteContactCategoryByName",
      summary: "Remove a category from a contact by category name.",
      description:
        "Succeeds even when the contact has no category by that name, so the " +
        "response does not tell you whether anything was removed.",
      tags: ["ContactCategories"],
      parameters: [contactId],
      requestBody: jsonBody(
        object({
          contact_category: object({
            consultant_id: int(),
            name: str(),
          }),
        }),
      ),
      responses: {
        "200": jsonResponse("Removed (or nothing matched).", ref("Empty")),
      },
    },
  },

  "/contact_category_types": {
    get: listOp({
      operationId: "listContactCategoryTypes",
      summary: "List contact category types.",
      schema: "ContactCategoryType",
      tag: "Enumerations",
    }),
  },

  "/contacts/{contact_id}/notes": {
    post: {
      operationId: "createContactNote",
      summary: "Add a note to a contact.",
      tags: ["Contacts"],
      parameters: [contactId],
      requestBody: jsonBody(
        object({ note: object({ text: str(), consultant_id: int() }) }),
      ),
      responses: {
        "201": jsonResponse("Note created.", ref("CreatedId")),
        "400": badRequest,
      },
    },
  },

  "/rental_listings": {
    get: listOp({
      operationId: "listRentalListings",
      summary: "List rental listings.",
      schema: "RentalListing",
      tag: "Listings",
    }),
  },

  "/sales_listings": {
    get: listOp({
      operationId: "listSalesListings",
      summary: "List sales listings, including the commission voucher.",
      schema: "SalesListing",
      tag: "Listings",
    }),
  },

  "/sales_listings/{id}": {
    patch: {
      operationId: "updateSalesListing",
      summary: "Update a sales listing's primary consultant and/or vendors.",
      description:
        "Only these two members can be changed. Unlike the other writes, this " +
        "returns the FULL updated listing rather than `{}`.",
      tags: ["Listings"],
      parameters: [pathParam("id", "Sales listing ID")],
      requestBody: jsonBody(
        object({
          sales_listing: object({
            primary_consultant_id: int(),
            vendor_ids: arrayOf(int()),
          }),
        }),
      ),
      responses: {
        "200": jsonResponse("The updated listing.", ref("SalesListing")),
        "400": badRequest,
      },
    },
  },

  "/contacts/{contact_id}/criteria": {
    post: {
      operationId: "createSearchCriteria",
      summary: "Create buying criteria for a contact.",
      tags: ["SearchCriteria"],
      parameters: [contactId],
      requestBody: jsonBody(
        object({
          criteria: object({
            type: str("`sales` or `rental`."),
            suburb_ids: arrayOf(int()),
            property_type_ids: arrayOf(int()),
            property_category_ids: arrayOf(int()),
            beds_from: int(),
            beds_to: int(),
            baths: int(),
            rooms: int(),
            cars: int(),
            price_from: str("Sent as a string in the blueprint's example."),
            price_to: str("Sent as a string in the blueprint's example."),
            house_size_from: num(),
            house_size_to: num(),
            house_measure: str("`Square(s)` or `Sqm`."),
            land_size_from: num(),
            land_size_to: num(),
            land_measure: str("`Acre(s)`, `Hectare(s)`, `Square(s)` or `Sqm`."),
            return_pa_from: num(),
            return_pa_to: num(),
            notes: str(),
            ealert_enabled: bool(
              "Write-only: accepted here, never returned on the read side.",
            ),
          }),
        }),
      ),
      responses: {
        "201": jsonResponse("Criteria created.", ref("CreatedId")),
        "400": badRequest,
      },
    },
  },

  "/contacts/{contact_id}/criteria/{id}": {
    patch: {
      operationId: "updateSearchCriteria",
      summary: "Update buying criteria.",
      tags: ["SearchCriteria"],
      parameters: [contactId, pathParam("id", "Criteria ID")],
      requestBody: jsonBody(
        object({
          criteria: object({
            type: str(),
            suburb_ids: arrayOf(int()),
            property_type_ids: arrayOf(int()),
            property_category_ids: arrayOf(int()),
            beds_from: int(),
            beds_to: int(),
            baths: int(),
            rooms: int(),
            cars: int(),
            price_from: str(),
            price_to: str(),
            house_size_from: num(),
            house_size_to: num(),
            house_measure: str(),
            land_size_from: num(),
            land_size_to: num(),
            land_measure: str(),
            return_pa_from: num(),
            return_pa_to: num(),
            notes: str(),
            ealert_enabled: bool(),
          }),
        }),
      ),
      responses: {
        "200": jsonResponse("Updated. The body is `{}`.", ref("Empty")),
      },
    },
    delete: {
      operationId: "deleteSearchCriteria",
      summary: "Delete buying criteria.",
      tags: ["SearchCriteria"],
      parameters: [contactId, pathParam("id", "Criteria ID")],
      responses: {
        "200": jsonResponse("Deleted. The body is `{}`.", ref("Empty")),
      },
    },
  },

  "/tasks": {
    get: listOp({
      operationId: "listTasks",
      summary: "List tasks.",
      schema: "Task",
      tag: "Tasks",
    }),
    post: {
      operationId: "createTasks",
      summary: "Create one or more tasks.",
      description:
        "Batch endpoint. The response is a BARE ARRAY positionally matching " +
        "the submitted tasks, each entry either `{ id }` or `{ errors }` — so " +
        "a 200 does not mean every task was created. Note the create member " +
        "is `action_date`, while the read side returns `task_date`.",
      tags: ["Tasks"],
      requestBody: jsonBody(
        object({
          tasks: arrayOf(
            object({
              subject: str(),
              contact_ids: arrayOf(int()),
              action_date: date(),
              consultant_id: int(),
              kind: str(
                "`Phone`, `Email`, `SMS`, `Letter`, `Task`, `Web enquiry` or `Others`.",
              ),
            }),
          ),
        }),
      ),
      responses: {
        "200": jsonResponse(
          "Per-task results, positionally matching the request.",
          {
            type: "array",
            items: object({
              id: int(),
              errors: { type: "object", nullable: true },
            }),
          },
        ),
      },
    },
  },

  "/contacts/{contact_id}/tasks": {
    get: listOp({
      operationId: "listContactTasks",
      summary: "List a contact's tasks.",
      schema: "Task",
      tag: "Tasks",
      params: [contactId],
    }),
  },

  "/contacts/{contact_id}/completed_tasks": {
    get: listOp({
      operationId: "listContactCompletedTasks",
      summary: "List a contact's completed tasks.",
      schema: "Task",
      tag: "Tasks",
      params: [contactId],
    }),
  },

  "/appointments": {
    get: listOp({
      operationId: "listAppointments",
      summary: "List future appointments.",
      schema: "Appointment",
      tag: "Appointments",
    }),
  },

  "/contacts/{contact_id}/appointments": {
    get: listOp({
      operationId: "listContactAppointments",
      summary: "List a contact's future appointments.",
      schema: "Appointment",
      tag: "Appointments",
      params: [contactId],
    }),
  },

  "/contacts/{contact_id}/past_appointments": {
    get: listOp({
      operationId: "listContactPastAppointments",
      summary: "List a contact's past appointments.",
      schema: "Appointment",
      tag: "Appointments",
      params: [contactId],
    }),
  },

  "/properties": {
    get: listOp({
      operationId: "listProperties",
      summary: "List properties.",
      schema: "Property",
      tag: "Properties",
    }),
  },

  "/buyer_notes": {
    get: listOp({
      operationId: "listBuyerNotes",
      summary: "List buyer notes.",
      schema: "BuyerNote",
      tag: "Communications",
    }),
  },

  "/emails": {
    get: listOp({
      operationId: "listEmails",
      summary: "List emails.",
      schema: "Email",
      tag: "Communications",
    }),
  },

  "/sms_messages": {
    get: listOp({
      operationId: "listSmsMessages",
      summary: "List SMS messages.",
      schema: "SmsMessage",
      tag: "Communications",
    }),
  },

  "/contact_activity_types": {
    get: listOp({
      operationId: "listContactActivityTypes",
      summary: "List contact activity types.",
      schema: "ContactActivityType",
      tag: "Enumerations",
    }),
  },

  "/property_types": {
    get: listOp({
      operationId: "listPropertyTypes",
      summary: "List property types.",
      schema: "PropertyType",
      tag: "Enumerations",
    }),
  },

  "/property_categories": {
    get: listOp({
      operationId: "listPropertyCategories",
      summary: "List property categories.",
      schema: "PropertyCategory",
      tag: "Enumerations",
    }),
  },

  "/offices": {
    get: listOp({
      operationId: "listOffices",
      summary: "List offices.",
      schema: "Office",
      tag: "Enumerations",
    }),
  },

  "/appraisals": {
    get: listOp({
      operationId: "listAppraisals",
      summary: "List appraisals.",
      schema: "Appraisal",
      tag: "Appraisals",
    }),
    post: {
      operationId: "createAppraisal",
      summary: "Create an appraisal.",
      tags: ["Appraisals"],
      requestBody: jsonBody(
        object({
          appraisal: object({
            appraisal_status: str(
              "`current` (default), `cancelled` or `listed`.",
            ),
            appraisal_source: str(),
            contact_ids: arrayOf(int("Required.")),
            office_id: int("Required."),
            property_id: int("Required."),
            primary_consultant_id: int("Required."),
            price_from: num(),
            price_to: num(),
          }),
        }),
      ),
      responses: {
        "201": jsonResponse("The created appraisal.", ref("Appraisal")),
        "400": badRequest,
      },
    },
  },

  "/appraisals/{id}": {
    put: {
      operationId: "updateAppraisal",
      summary: "Update an appraisal.",
      description:
        "Status transitions are one-way and restricted to current → " +
        "cancelled, current → listed, and cancelled → listed.",
      tags: ["Appraisals"],
      parameters: [pathParam("id", "Appraisal ID")],
      requestBody: jsonBody(
        object({
          appraisal: object({
            appraisal_status: str(),
            appraisal_source: str(),
            contact_ids: arrayOf(int()),
            office_id: int(),
            property_id: int(),
            primary_consultant_id: int(),
            price_from: num(),
            price_to: num(),
          }),
        }),
      ),
      responses: {
        "200": jsonResponse("The updated appraisal.", ref("Appraisal")),
        "400": badRequest,
      },
    },
  },

  "/inspection_attendances": {
    get: listOp({
      operationId: "listInspectionAttendances",
      summary: "List inspection attendances.",
      schema: "InspectionAttendance",
      tag: "Inspections",
    }),
  },
};

// ============================================================================
// Document
// ============================================================================

const spec = {
  openapi: "3.0.3",
  info: {
    title: "Box+Dice AI API",
    version: "1.0.0",
    description:
      "Transcribed from the API Blueprint at " +
      "https://boxdiceaiapi.docs.apiary.io/ by scripts/build-spec.ts. " +
      "The response side has NOT been verified against a live tenant.",
  },
  servers: [
    {
      url: "https://{tenant}.boxdice.com.au/ai_api",
      description:
        "Per-tenant. `tenant` is the agency's Box+Dice subdomain; the path " +
        "segment is whichever partner API the key was provisioned for.",
      variables: { tenant: { default: "your-domain" } },
    },
  ],
  paths: PATHS,
  components: { schemas: SCHEMAS },
};

const operationCount = Object.values(PATHS).reduce(
  (n, item) => n + Object.keys(item).length,
  0,
);
const unresolvedCount = JSON.stringify(spec).split("UNRESOLVED:").length - 1;

const out = path.join(root, "specs/openapi.json");
await writeFile(out, `${JSON.stringify(spec, null, 2)}\n`);

console.log(
  `specs/openapi.json — ${Object.keys(PATHS).length} paths, ` +
    `${operationCount} operations, ${Object.keys(SCHEMAS).length} schemas, ` +
    `${unresolvedCount} unresolved member(s)`,
);
