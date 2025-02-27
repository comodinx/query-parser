const { map } = require("lodash");
const { col, fn } = require("sequelize");
const properties = require("./properties");

//
// source code
//
module.exports = (query, options = {}) => {
  const result = properties(query, "fields", { ...options, skipFirstLevelProperty: true });

  if (result && result.fields) {
    const fields = map(result.fields, (field) => {
      const parts = field.split("-");

      if (parts.length <= 1) {
        return field;
      }

      return [fn(parts[0], col(parts[1])), parts[2] || (parts[1] !== "*" ? parts[1] : parts[0])];
    });

    result.fields = fields && fields.length === 1 && fields[0] === "*" ? null : fields;
  }

  return result;
};
