import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const ContactsEnhancedPrivacyDataExportInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    contact_id: Schema.Unknown,
    export_format: Schema.optional(Schema.Unknown),
  }).pipe(
    T.Http({
      method: "POST",
      path: "/v1/rex/Contacts::enhancedPrivacyDataExport",
    }),
  );
export type ContactsEnhancedPrivacyDataExportInput =
  typeof ContactsEnhancedPrivacyDataExportInput.Type;

// Output Schema
export const ContactsEnhancedPrivacyDataExportOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Unknown;
export type ContactsEnhancedPrivacyDataExportOutput =
  typeof ContactsEnhancedPrivacyDataExportOutput.Type;

// The operation
export const ContactsEnhancedPrivacyDataExport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    inputSchema: ContactsEnhancedPrivacyDataExportInput,
    outputSchema: ContactsEnhancedPrivacyDataExportOutput,
  }));
