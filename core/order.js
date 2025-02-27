const { map, merge } = require("lodash");

//
// constants
//
const directions = ["DESC", "ASC"];
const defaultMapping = {
  date: "created_at"
};

//
// source code
//
module.exports = (query, mapping = {}) => {
  if (!query || !query.order) {
    return;
  }

  mapping = merge({}, defaultMapping, mapping);

  return map(query.order.split(query.orderSeparator || ","), (condition) => {
    const [key, direction] = condition.split("-");
    const order = [mapping[key] || key];

    if (direction && directions.includes(direction.toUpperCase())) {
      order.push(direction.toUpperCase());
    }

    return order;
  });
};
