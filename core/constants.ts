import { ParserPropertyType } from "./types";

//
// pagination
//
export const paginationPageSize = 0;

//
// fields
//
export const fieldSeparator = ",";
export const fieldConcatenator = ".";
export const fieldGroupConcatenator = "-";
export const fieldAllIndicator = "*";

//
// orders
//
export const orderDirections = ["DESC", "ASC"];
export const orderMappingFieldNames: Record<string, string> = {
  date: "created_at"
};
export const orderSeparator = ",";
export const orderConcatenator = "-";

//
// groups
//
export const groupSeparator = ",";

//
// filters
//
export const filtersJsonKeys = ["metadata"];
export const keyPattern = "[A-Za-z0-9_.]+";
// eslint-disable-next-line no-useless-escape
export const valueLikeFormat = /\%/g;
export const valueLikeParse = /\*/g;

//
// properties
//

export const propertiesSeparator = ",";
export const propertiesConcatenator = ".";
export const propertiesRemotePrefix = "r-";
export const propertiesExtraPrefix = "e-";
export const propertiesMapTypes: Record<ParserPropertyType, ParserPropertyType> = {
  attributes: "attributes",
  fields: "attributes",
  include: "include"
};

//
// helpers
//
export const trues = ["true", "on"];
export const falses = ["false", "off"];
export const booleans = [...trues, ...falses];
