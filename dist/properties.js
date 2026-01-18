"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseProperties = void 0;
const lodash_1 = require("lodash");
const constants = __importStar(require("./constants"));
//
// helpers
//
const getDefaultSeparator = (type, query, options) => {
    return (((0, lodash_1.isObject)(query) ? query[`${type}Separator`] : undefined) ||
        ((0, lodash_1.isObject)(options) ? options[`${type}Separator`] : undefined) ||
        constants.propertiesSeparator);
};
const getDefaultConcatenator = (type, query, options) => {
    return (((0, lodash_1.isObject)(query) ? query[`${type}Concatenator`] : undefined) ||
        ((0, lodash_1.isObject)(options) ? options[`${type}Concatenator`] : undefined) ||
        constants.propertiesConcatenator);
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
const isRemoteProperty = (property) => property.startsWith(constants.propertiesRemotePrefix);
/**
 * Normalize remote property if necesary
 *
 *   r-person
 *   \______/ -> This is the remote prefix. Then, return "person"
 *
 *   person
 *   \____/ -> This is the normal property. Then, return "person"
 */
const normalizeRemoteProperty = (property) => property.replace(constants.propertiesRemotePrefix, "");
/**
 * Indicate if property is extra property
 *
 *   e-person
 *   \/ -> This is the extra prefix. Then, return true
 *
 *   person
 *   \____/ -> This is the normal property. Then, return false
 */
const isExtraProperty = (property) => property.startsWith(constants.propertiesExtraPrefix);
/**
 * Normalize extra property if necesary
 *
 *   e-person
 *   \______/ -> This is the extra prefix. Then, return "person"
 *
 *   person
 *   \____/ -> This is the normal property. Then, return "person"
 */
const normalizeExtraProperty = (property) => property.replace(constants.propertiesExtraPrefix, "");
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
const normalizeRemoteExtraProperty = (property) => normalizeExtraProperty(normalizeRemoteProperty(property));
/**
 * Save related property in correct location
 *
 *   r-person
 *   \______/ -> This is the remote prefix. Then, save in opts.remotes
 *
 *   person
 *   \____/ -> This is the normal property. Then, save in carry
 */
const resolveProperty = (opts, property, carry) => {
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
const resolveRelationship = (context, type, property) => {
    type = constants.propertiesMapTypes[type] || type;
    if (!isRemoteProperty(property) && !isExtraProperty(property)) {
        context[type] = context[type] || [];
    }
    resolveProperty(context, property, context[type]);
};
//
// source code
//
const parseProperties = (query, type, options = {}) => {
    if (!query || !query[type] || ((0, lodash_1.isString)(query[type]) && !query[type].trim())) {
        return;
    }
    const concatenator = getDefaultConcatenator(type, query, options);
    const separator = getDefaultSeparator(type, query, options);
    const properties = (0, lodash_1.isString)(query[type]) ? query[type].trim().split(separator) : query[type];
    const opts = {
        [type]: []
    };
    opts[type] = (0, lodash_1.reduce)(properties, (carry, property) => {
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
                }
                else {
                    // prepare relations options
                    parentPropertyOpts.relations = parentPropertyOpts.relations || {};
                    parentPropertyOpts.relations[parentPropertyName] =
                        parentPropertyOpts.relations[parentPropertyName] || {};
                    // Resolve no first parts of property.
                    //
                    //  user.status...
                    //       \_____________ -> This parts
                    //
                    resolveRelationship(parentPropertyOpts.relations[parentPropertyName], type, partOfProperty);
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
    }, opts[type]);
    return opts;
};
exports.parseProperties = parseProperties;
