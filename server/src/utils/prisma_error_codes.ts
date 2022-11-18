//
/**
 * MAP OF PRISMA ERROR CODES
 * Error Codes can be found at: https://www.prisma.io/docs/reference/api-reference/error-reference#common
 */
export const PRISMA_ERROR_CODES = {
  TOO_LONG_VALUE: "P2000",
  WHERE_CONDITION_DOESNT_EXIST: "P2001",
  UNIQUE_CONSTRAINT_FAIL: "P2002",
  FOREIGN_KEY_CONSTRAINT_FAIL: "P2003",
  OTHER_CONSTRAINT_FAIL: "P2004",
  VALUE_INVALID_FOR_FIELD: "P2005",
  VALUE_INVALID_FOR_MODEL_FIELD: "P2006",
  DATA_VALIDATION_ERROR: "P2007",
  QUERY_PARSE_FAIL: "P2008",
  QUERY_VALIDATION_FAIL: "P2009",
  RAW_QUERY_FAIL: "P2010",
  NOT_NULL_CONSTRAINT_FAIL: "P2011",
  MISSING_REQUIRED_VALUE: "P2012",
  MISSING_REQUIRED_ARGUMENT: "P2013",
  RELATION_VOILATION: "P2014",
  RECORD_NOT_FOUND: "P2015",
  QUERY_INTREPRETATION_ERROR: "P2016",
  INVALID_RELATIONSHIP: "P2017",
  RELATIONSHIP_RECORD_NOT_FOUND: "P2018",
  INPUT_ERROR: "P2019",
  VALUE_OUT_OF_RANGE: "P2020",
  TABLE_DOESNOT_EXIST: "P2021",
};

/**
 * Not Mentioned Error codes are in the docs.
 * The error returned outsiude of the above list will provide status code of 409 (conflict) and message of Database Error, with prisma error code appended.
 */
