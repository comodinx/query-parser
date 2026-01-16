import { isObject, isString, reduce } from "lodash";
import { ParserQuery, ParserOptions, ParserResult, ParserPropertyType } from "./types";

//
// constants
//
const defaultSeparator = ",";
const defaultConcatenator = ".";
const defaultRemotePrefix = "r-";
const defaultExtraPrefix = "e-";
const mapTypes: Record<ParserPropertyType, ParserPropertyType> = {
  attributes: "attributes",
  fields: "attributes",
  include: "include"
};

//
// helpers
//
const getDefaultSeparator = (
  type: ParserPropertyType,
  query: ParserQuery,
  options: ParserOptions
): string => {
  return (
    (isObject(query) ? query[`${type}Separator`] : undefined) ||
    (isObject(options) ? options[`${type}Separator`] : undefined) ||
    defaultSeparator
  );
};

const getDefaultConcatenator = (
  type: ParserPropertyType,
  query: ParserQuery,
  options: ParserOptions
): string => {
  return (
    (isObject(query) ? query[`${type}Concatenator`] : undefined) ||
    (isObject(options) ? options[`${type}Concatenator`] : undefined) ||
    defaultConcatenator
  );
};

/**
 * Indicate if property is remote property
 *
 *   r-person
 *   \/ -> This is the remote prefix. Then, return true
 *
 *   person
 *   \____/ -> This is the normal property. Then, return false
 */
const isRemoteProperty = (property: string): boolean => property.startsWith(defaultRemotePrefix);

/**
 * Normalize remote property if necesary
 *
 *   r-person
 *   \______/ -> This is the remote prefix. Then, return "person"
 *
 *   person
 *   \____/ -> This is the normal property. Then, return "person"
 */
const normalizeRemoteProperty = (property: string): string =>
  property.replace(defaultRemotePrefix, "");

/**
 * Indicate if property is extra property
 *
 *   e-person
 *   \/ -> This is the extra prefix. Then, return true
 *
 *   person
 *   \____/ -> This is the normal property. Then, return false
 */
const isExtraProperty = (property: string): boolean => property.startsWith(defaultExtraPrefix);

/**
 * Normalize extra property if necesary
 *
 *   e-person
 *   \______/ -> This is the extra prefix. Then, return "person"
 *
 *   person
 *   \____/ -> This is the normal property. Then, return "person"
 */
const normalizeExtraProperty = (property: string): string =>
  property.replace(defaultExtraPrefix, "");

/**
 * Normalize remote or extra property if necesary
 *
 *   r-person
 *   \______/ -> This is the remote prefix. Then, return "person"
 *   e-person
 *   \______/ -> This is the extra prefix. Then, return "person"
 *
 *   person
 *   \____/ -> This is the normal property. Then, return "person"
 */
const normalizeRemoteExtraProperty = (property: string): string =>
  normalizeExtraProperty(normalizeRemoteProperty(property));

/**
 * Save related property in correct location
 *
 *   r-person
 *   \______/ -> This is the remote prefix. Then, save in opts.remotes
 *
 *   person
 *   \____/ -> This is the normal property. Then, save in carry
 */
const resolveProperty = (opts: ParserResult, property: string, carry: string[]): void => {
  // Check if property is remote property
  //
  //   r-person
  //   \/ -> This is the remote prefix
  //
  if (isRemoteProperty(property)) {
    const rawProperty = normalizeRemoteProperty(property);

    opts.remotes = opts.remotes || [];

    if (!opts.remotes.includes(rawProperty)) {
      opts.remotes.push(rawProperty);
    }
  }
  // Check if property is extra property
  //
  //   e-person
  //   \/ -> This is the extra prefix
  //
  else if (isExtraProperty(property)) {
    const rawProperty = normalizeExtraProperty(property);

    opts.extras = opts.extras || [];

    if (!opts.extras.includes(rawProperty)) {
      opts.extras.push(rawProperty);
    }
  }
  // Handle simple property
  //
  //   user
  //   \__/ -> This is the simple property
  //
  else if (!carry.includes(property)) {
    carry.push(property);
  }
};

const resolveRelationship = (
  context: ParserResult,
  type: ParserPropertyType,
  property: string
): void => {
  type = mapTypes[type] || type;

  if (!isRemoteProperty(property) && !isExtraProperty(property)) {
    context[type] = context[type] || [];
  }
  resolveProperty(context, property, context[type]);
};

//
// source code
//
export const parseProperties = (
  query: ParserQuery,
  type: ParserPropertyType,
  options: ParserOptions = {}
): Partial<ParserResult> | undefined => {
  if (!query || !query[type]) {
    return;
  }

  const concatenator = getDefaultConcatenator(type, query, options);
  const separator = getDefaultSeparator(type, query, options);
  const properties = isString(query[type]) ? query[type].split(separator) : query[type];
  const opts: Partial<ParserResult> = {
    [type]: []
  };

  opts[type] = reduce(
    properties,
    (carry, property) => {
      let isFirstLevelProperty = true;
      let parentPropertyName;
      let parentPropertyOpts;

      // Check if property is complex.
      //
      //  user.status
      //      | -> This is the concatenator
      //
      if (property.includes(concatenator)) {
        property.split(concatenator).forEach((partOfProperty) => {
          const rawProperty = normalizeRemoteExtraProperty(partOfProperty);

          // Check if is initial part of property.
          //
          //  user.status
          //  \__/ -> This part
          //
          if (isFirstLevelProperty) {
            isFirstLevelProperty = false;

            if (!options.skipFirstLevelProperty) {
              resolveProperty(opts, partOfProperty, carry);
            }
          } else {
            // prepare relations options
            parentPropertyOpts.relations = parentPropertyOpts.relations || {};
            parentPropertyOpts.relations[parentPropertyName] =
              parentPropertyOpts.relations[parentPropertyName] || {};

            // Resolve no first parts of property.
            //
            //  user.status...
            //       \_____________ -> This parts
            //
            resolveRelationship(
              parentPropertyOpts.relations[parentPropertyName],
              type,
              partOfProperty
            );
          }

          // save previous property options
          parentPropertyOpts =
            (parentPropertyOpts &&
              parentPropertyOpts.relations &&
              parentPropertyOpts.relations[parentPropertyName || rawProperty]) ||
            opts;

          // save previous property name
          parentPropertyName = normalizeRemoteExtraProperty(partOfProperty);
        });
      }
      // Handle single property
      //
      //  status
      //    | -> Property without concatenator
      //
      else {
        resolveProperty(opts, property, carry);
      }

      return carry;
    },
    opts[type]
  );

  return opts;
};
