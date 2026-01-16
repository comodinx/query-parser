import { merge } from "lodash";
import { ParserOptions, ParserQuery, ParserResult } from "./types";

//
// constants
//
const directions = ["DESC", "ASC"];
const defaultMapping = {
  date: "created_at"
};
const defaultSeparator = ",";
const defaultGroupSeparator = "-";

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

  const mapping = merge({}, defaultMapping, options.orderMapping || {});
  const separator = query.orderSeparator || options.orderSeparator || defaultSeparator;
  const groupSeparator =
    query.orderGroupSeparator || options.orderGroupSeparator || defaultGroupSeparator;

  return query.order.split(separator).map((condition: string) => {
    const [key, direction] = condition.split(groupSeparator);
    const order = [mapping[key] || key];

    if (direction && directions.includes(direction.toUpperCase())) {
      order.push(direction.toUpperCase());
    }

    return order;
  });
};
