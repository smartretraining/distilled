import * as Schema from "effect/Schema";
import { API } from "../client.ts";
import * as T from "../traits.ts";

// Input Schema
export const AdminValueListsDescribeInput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.Struct({
    include_detail: Schema.optional(Schema.Boolean),
  }).pipe(
    T.Http({ method: "POST", path: "/v1/rex/AdminValueLists::describe" }),
  );
export type AdminValueListsDescribeInput =
  typeof AdminValueListsDescribeInput.Type;

// Output Schema
export const AdminValueListsDescribeOutput =
  /*@__PURE__*/ /*#__PURE__*/ Schema.NullOr(
    Schema.Struct({
      name: Schema.optional(Schema.NullOr(Schema.String)),
      description: Schema.optional(Schema.NullOr(Schema.String)),
      detail: Schema.optional(Schema.NullOr(Schema.String)),
      methods: Schema.optional(
        Schema.NullOr(
          Schema.Struct({
            archive: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  description: Schema.optional(Schema.NullOr(Schema.String)),
                  parameters: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        id: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(Schema.Unknown),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                  returns: Schema.optional(Schema.NullOr(Schema.String)),
                  openapi: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        available: Schema.optional(
                          Schema.NullOr(Schema.Boolean),
                        ),
                        description: Schema.optional(
                          Schema.NullOr(Schema.String),
                        ),
                        request: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              parameters: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    id: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          required: Schema.optional(
                                            Schema.NullOr(Schema.Boolean),
                                          ),
                                          definition: Schema.optional(
                                            Schema.NullOr(
                                              Schema.Struct({
                                                description: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                type: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                              }),
                                            ),
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                              examples: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    Example1: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          id: Schema.optional(
                                            Schema.NullOr(Schema.Number),
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                            }),
                          ),
                        ),
                        response: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              examples: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    Example1: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          result: Schema.optional(
                                            Schema.NullOr(Schema.Number),
                                          ),
                                          error: Schema.optional(
                                            Schema.Unknown,
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                              schema: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              statuses: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    "200": Schema.optional(
                                      Schema.NullOr(Schema.String),
                                    ),
                                  }),
                                ),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                }),
              ),
            ),
            create: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  description: Schema.optional(Schema.NullOr(Schema.String)),
                  parameters: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        data: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(Schema.Unknown),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                        return_id: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                  returns: Schema.optional(Schema.NullOr(Schema.String)),
                  openapi: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        available: Schema.optional(
                          Schema.NullOr(Schema.Boolean),
                        ),
                        description: Schema.optional(
                          Schema.NullOr(Schema.String),
                        ),
                        request: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              parameters: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    data: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Array(Schema.Unknown),
                                      ),
                                    ),
                                    return_id: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          required: Schema.optional(
                                            Schema.NullOr(Schema.Boolean),
                                          ),
                                          definition: Schema.optional(
                                            Schema.NullOr(
                                              Schema.Struct({
                                                description: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                type: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                default: Schema.optional(
                                                  Schema.NullOr(Schema.Boolean),
                                                ),
                                              }),
                                            ),
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                              examples: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    Example1: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Array(Schema.Unknown),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                            }),
                          ),
                        ),
                        response: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              examples: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    Example1: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Array(Schema.Unknown),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                              schema: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              statuses: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    "200": Schema.optional(
                                      Schema.NullOr(Schema.String),
                                    ),
                                  }),
                                ),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                }),
              ),
            ),
            read: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  description: Schema.optional(Schema.NullOr(Schema.String)),
                  parameters: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        id: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(Schema.Unknown),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                        fields: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                        extra_fields: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(
                                Schema.NullOr(
                                  Schema.Array(Schema.NullOr(Schema.String)),
                                ),
                              ),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                  returns: Schema.optional(Schema.NullOr(Schema.String)),
                  openapi: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        available: Schema.optional(
                          Schema.NullOr(Schema.Boolean),
                        ),
                        description: Schema.optional(
                          Schema.NullOr(Schema.String),
                        ),
                        request: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              parameters: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              examples: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                            }),
                          ),
                        ),
                        response: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              examples: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              schema: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              statuses: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                }),
              ),
            ),
            recoverFromArchive: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  description: Schema.optional(Schema.NullOr(Schema.String)),
                  parameters: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        id: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(Schema.Unknown),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                  returns: Schema.optional(Schema.NullOr(Schema.String)),
                  openapi: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        available: Schema.optional(
                          Schema.NullOr(Schema.Boolean),
                        ),
                        description: Schema.optional(
                          Schema.NullOr(Schema.String),
                        ),
                        request: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              parameters: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    id: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          required: Schema.optional(
                                            Schema.NullOr(Schema.Boolean),
                                          ),
                                          definition: Schema.optional(
                                            Schema.NullOr(
                                              Schema.Struct({
                                                description: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                type: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                              }),
                                            ),
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                              examples: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    Example1: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          id: Schema.optional(
                                            Schema.NullOr(Schema.Number),
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                            }),
                          ),
                        ),
                        response: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              examples: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    Example1: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          result: Schema.optional(
                                            Schema.NullOr(Schema.Number),
                                          ),
                                          error: Schema.optional(
                                            Schema.Unknown,
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                              schema: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              statuses: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    "200": Schema.optional(
                                      Schema.NullOr(Schema.String),
                                    ),
                                  }),
                                ),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                }),
              ),
            ),
            recoverFromTrash: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  description: Schema.optional(Schema.NullOr(Schema.String)),
                  parameters: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        id: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(Schema.Unknown),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                  returns: Schema.optional(Schema.NullOr(Schema.String)),
                  openapi: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        available: Schema.optional(
                          Schema.NullOr(Schema.Boolean),
                        ),
                        description: Schema.optional(
                          Schema.NullOr(Schema.String),
                        ),
                        request: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              parameters: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    id: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          required: Schema.optional(
                                            Schema.NullOr(Schema.Boolean),
                                          ),
                                          definition: Schema.optional(
                                            Schema.NullOr(
                                              Schema.Struct({
                                                description: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                type: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                              }),
                                            ),
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                              examples: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    Example1: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          id: Schema.optional(
                                            Schema.NullOr(Schema.Number),
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                            }),
                          ),
                        ),
                        response: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              examples: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    Example1: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          result: Schema.optional(
                                            Schema.NullOr(Schema.Number),
                                          ),
                                          error: Schema.optional(
                                            Schema.Unknown,
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                              schema: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              statuses: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    "200": Schema.optional(
                                      Schema.NullOr(Schema.String),
                                    ),
                                  }),
                                ),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                }),
              ),
            ),
            search: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  description: Schema.optional(Schema.NullOr(Schema.String)),
                  parameters: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        criteria: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                        order_by: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                        offset: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(
                                Schema.NullOr(Schema.Number),
                              ),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                        limit: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(
                                Schema.NullOr(Schema.Number),
                              ),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                        create_viewstate: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                        search_state: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                        ids_only: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                        result_format: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                        extra_options: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                  returns: Schema.optional(Schema.NullOr(Schema.String)),
                  openapi: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        available: Schema.optional(
                          Schema.NullOr(Schema.Boolean),
                        ),
                        description: Schema.optional(
                          Schema.NullOr(Schema.String),
                        ),
                        request: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              parameters: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    criteria: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          required: Schema.optional(
                                            Schema.NullOr(Schema.Boolean),
                                          ),
                                          definition: Schema.optional(
                                            Schema.NullOr(
                                              Schema.Struct({
                                                description: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                type: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                              }),
                                            ),
                                          ),
                                        }),
                                      ),
                                    ),
                                    order_by: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          required: Schema.optional(
                                            Schema.NullOr(Schema.Boolean),
                                          ),
                                          definition: Schema.optional(
                                            Schema.NullOr(
                                              Schema.Struct({
                                                description: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                type: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                              }),
                                            ),
                                          ),
                                        }),
                                      ),
                                    ),
                                    offset: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          required: Schema.optional(
                                            Schema.NullOr(Schema.Boolean),
                                          ),
                                          definition: Schema.optional(
                                            Schema.NullOr(
                                              Schema.Struct({
                                                description: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                type: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                default: Schema.optional(
                                                  Schema.NullOr(Schema.Number),
                                                ),
                                              }),
                                            ),
                                          ),
                                        }),
                                      ),
                                    ),
                                    limit: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          required: Schema.optional(
                                            Schema.NullOr(Schema.Boolean),
                                          ),
                                          definition: Schema.optional(
                                            Schema.NullOr(
                                              Schema.Struct({
                                                description: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                type: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                default: Schema.optional(
                                                  Schema.NullOr(Schema.Number),
                                                ),
                                              }),
                                            ),
                                          ),
                                        }),
                                      ),
                                    ),
                                    create_viewstate: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          required: Schema.optional(
                                            Schema.NullOr(Schema.Boolean),
                                          ),
                                          definition: Schema.optional(
                                            Schema.NullOr(
                                              Schema.Struct({
                                                description: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                type: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                default: Schema.optional(
                                                  Schema.NullOr(Schema.Boolean),
                                                ),
                                              }),
                                            ),
                                          ),
                                        }),
                                      ),
                                    ),
                                    result_format: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          required: Schema.optional(
                                            Schema.NullOr(Schema.Boolean),
                                          ),
                                          definition: Schema.optional(
                                            Schema.NullOr(
                                              Schema.Struct({
                                                description: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                type: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                default: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                              }),
                                            ),
                                          ),
                                        }),
                                      ),
                                    ),
                                    extra_options: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          required: Schema.optional(
                                            Schema.NullOr(Schema.Boolean),
                                          ),
                                          definition: Schema.optional(
                                            Schema.NullOr(
                                              Schema.Struct({
                                                description: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                type: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                              }),
                                            ),
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                              examples: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    Example1: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          limit: Schema.optional(
                                            Schema.NullOr(Schema.Number),
                                          ),
                                          offset: Schema.optional(
                                            Schema.NullOr(Schema.Number),
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                            }),
                          ),
                        ),
                        response: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              examples: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    Example1: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Array(Schema.Unknown),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                              schema: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              statuses: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    "200": Schema.optional(
                                      Schema.NullOr(Schema.String),
                                    ),
                                  }),
                                ),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                }),
              ),
            ),
            trash: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  description: Schema.optional(Schema.NullOr(Schema.String)),
                  parameters: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        id: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(Schema.Unknown),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                  returns: Schema.optional(Schema.NullOr(Schema.String)),
                  openapi: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        available: Schema.optional(
                          Schema.NullOr(Schema.Boolean),
                        ),
                        description: Schema.optional(
                          Schema.NullOr(Schema.String),
                        ),
                        request: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              parameters: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    id: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          required: Schema.optional(
                                            Schema.NullOr(Schema.Boolean),
                                          ),
                                          definition: Schema.optional(
                                            Schema.NullOr(
                                              Schema.Struct({
                                                description: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                type: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                              }),
                                            ),
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                              examples: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    Example1: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          id: Schema.optional(
                                            Schema.NullOr(Schema.Number),
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                            }),
                          ),
                        ),
                        response: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              examples: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    Example1: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          result: Schema.optional(
                                            Schema.NullOr(Schema.Number),
                                          ),
                                          error: Schema.optional(
                                            Schema.Unknown,
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                              schema: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              statuses: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    "200": Schema.optional(
                                      Schema.NullOr(Schema.String),
                                    ),
                                  }),
                                ),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                }),
              ),
            ),
            update: Schema.optional(
              Schema.NullOr(
                Schema.Struct({
                  description: Schema.optional(Schema.NullOr(Schema.String)),
                  parameters: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        data: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(Schema.Unknown),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                        fields: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                        extra_fields: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              comment: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              type: Schema.optional(
                                Schema.NullOr(Schema.String),
                              ),
                              default_value: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              required: Schema.optional(
                                Schema.NullOr(Schema.Boolean),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                  returns: Schema.optional(Schema.NullOr(Schema.String)),
                  openapi: Schema.optional(
                    Schema.NullOr(
                      Schema.Struct({
                        available: Schema.optional(
                          Schema.NullOr(Schema.Boolean),
                        ),
                        description: Schema.optional(
                          Schema.NullOr(Schema.String),
                        ),
                        request: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              parameters: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    data: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Array(Schema.Unknown),
                                      ),
                                    ),
                                    fields: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          required: Schema.optional(
                                            Schema.NullOr(Schema.Boolean),
                                          ),
                                          definition: Schema.optional(
                                            Schema.NullOr(
                                              Schema.Struct({
                                                description: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                type: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                              }),
                                            ),
                                          ),
                                        }),
                                      ),
                                    ),
                                    extra_fields: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Struct({
                                          required: Schema.optional(
                                            Schema.NullOr(Schema.Boolean),
                                          ),
                                          definition: Schema.optional(
                                            Schema.NullOr(
                                              Schema.Struct({
                                                description: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                                type: Schema.optional(
                                                  Schema.NullOr(Schema.String),
                                                ),
                                              }),
                                            ),
                                          ),
                                        }),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                              examples: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    Example1: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Array(Schema.Unknown),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                            }),
                          ),
                        ),
                        response: Schema.optional(
                          Schema.NullOr(
                            Schema.Struct({
                              examples: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    Example1: Schema.optional(
                                      Schema.NullOr(
                                        Schema.Array(Schema.Unknown),
                                      ),
                                    ),
                                  }),
                                ),
                              ),
                              schema: Schema.optional(
                                Schema.NullOr(Schema.Array(Schema.Unknown)),
                              ),
                              statuses: Schema.optional(
                                Schema.NullOr(
                                  Schema.Struct({
                                    "200": Schema.optional(
                                      Schema.NullOr(Schema.String),
                                    ),
                                  }),
                                ),
                              ),
                            }),
                          ),
                        ),
                      }),
                    ),
                  ),
                }),
              ),
            ),
          }),
        ),
      ),
    }),
  );
export type AdminValueListsDescribeOutput =
  typeof AdminValueListsDescribeOutput.Type;

// The operation
/**
 * Describes the class and its methods - simply or in detail
 */
export const AdminValueListsDescribe = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    inputSchema: AdminValueListsDescribeInput,
    outputSchema: AdminValueListsDescribeOutput,
  }),
);
