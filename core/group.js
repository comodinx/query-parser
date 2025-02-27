//
// constants
//
const defaultSeparator = ",";

//
// source code
//
module.exports = (query) => {
  if (!query || !query.group) {
    return;
  }

  return query.group.split(query.groupSeparator || defaultSeparator);
};
