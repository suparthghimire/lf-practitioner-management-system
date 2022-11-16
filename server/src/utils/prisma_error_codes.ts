//
/**
 * MAP OF PRISMA ERROR CODES
 * Error Codes can be found at: https://www.prisma.io/docs/reference/api-reference/error-reference#common
 */
export const PRISMA_ERROR_CODES_QUERY = {
  TOO_LONG_VALUE: "2000",
  WHERE_CONDITION_DOESNT_EXIST: "2001",
  UNIQUE_CONSTRAINT_FAIL: "2002",
  FOREIGN_KEY_CONSTRAINT_FAIL: "2003",
  OTHER_CONSTRAINT_FAIL: "2004",
  VALUE_INVALID_FOR_FIELD: "2005",
  VALUE_INVALID_FOR_MODEL_FIELD: "2006",
  DATA_VALIDATION_ERROR: "2007",
  QUERY_PARSE_FAIL: "2008",
  QUERY_VALIDATION_FAIL: "2009",
  RAW_QUERY_FAIL: "2010",
  NOT_NULL_CONSTRAINT_FAIL: "2011",
  MISSING_REQUIRED_VALUE: "2012",
  MISSING_REQUIRED_ARGUMENT: "2013",
  RELATION_VOILATION: "2014",
  RECORD_NOT_FOUND: "2015",
  QUERY_INTREPRETATION_ERROR: "2016",
  INVALID_RELATIONSHIP: "2017",
  RELATIONSHIP_RECORD_NOT_FOUND: "2018",
  INPUT_ERROR: "2019",
  VALUE_OUT_OF_RANGE: "2020",
  TABLE_DOESNOT_EXIST: "2021",
};

/**
 * Not Mentioned Error codes are in the docs.
 * The error returned outsiude of the above list will provide status code of 409 (conflict) and message of Database Error, with prisma error code appended.
 */
