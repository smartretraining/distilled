/**
 * VaultRE SDK trait surface — hand-written.
 *
 * Re-exports the generic protocol traits from core (so generated operations
 * import everything from one place). VaultRE has no response envelope and no
 * bespoke wire conventions, so nothing VaultRE-specific appears here; the
 * REST-protocol traits (SensitiveValue / RawResponse) come from
 * `core/protocol-rest`.
 */
export {
  Body,
  Header,
  Query,
  Label,
  Http,
  ResponseCode,
  HttpBody,
  FormDataFile,
  KeyDictionary,
  UnionCases,
  applyErrorMatchers,
  getErrorMatchers,
  type HttpTrait,
  type ErrorMatcher,
  bodySymbol,
  headerSymbol,
  querySymbol,
  labelSymbol,
  httpSymbol,
  responseCodeSymbol,
  httpBodySymbol,
  formDataFileSymbol,
  keyDictionarySymbol,
  unionCasesSymbol,
  errorMatchersSymbol,
} from "@distilled.cloud/core/trait";

export {
  SensitiveValue,
  RawResponse,
  RawResponseRoot,
  sensitiveValueSymbol,
  rawResponseSymbol,
  rawResponseRootSymbol,
} from "@distilled.cloud/core/protocol-rest";
