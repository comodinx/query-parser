import { merge } from "lodash";
import { ParserOptions, ParserOrder, ParserQuery, ParserResult } from "./types";
import * as constants from "./constants";

//
// source code
//
export const parseOrder = (
  query: ParserQuery,
  options: ParserOptions = {}
): ParserResult["order"] | undefined => {
  if (!query || !query.order) {
    return;
  }

  const mapping: Record<string, string> = merge(
    {},
    constants.orderMappingFieldNames,
    options.orderMapping || {}
  );
  const separator = query.orderSeparator || options.orderSeparator || constants.orderSeparator;
  const concatenator =
    // @deprecated (retrocompatibility)
    query.orderGroupSeparator ||
    // @deprecated (retrocompatibility)
    options.orderGroupSeparator ||
    query.orderConcatenator ||
    options.orderConcatenator ||
    constants.orderConcatenator;

  return query.order.split(separator).map((condition: string) => {
    const [key, direction] = condition.split(concatenator);
    const order = [mapping[key] || key] as ParserOrder;

    if (direction && constants.orderDirections.includes(direction.toUpperCase())) {
      order.push(direction.toUpperCase());
    }

    return order as ParserOrder;
  });
};
