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
exports.parseFields = void 0;
const lodash_1 = require("lodash");
const sequelize_1 = require("sequelize");
const properties_1 = require("./properties");
const constants = __importStar(require("./constants"));
//
// source code
//
const parseFields = (query, options = {}) => {
    if (!query || !query.fields) {
        return;
    }
    const concatenator = query.fieldsGroupConcatenator ||
        options.fieldsGroupConcatenator ||
        constants.fieldGroupConcatenator;
    const result = (0, properties_1.parseProperties)(query, "fields", { ...options, skipFirstLevelProperty: true });
    if (result && result.fields) {
        const fields = (0, lodash_1.map)(result.fields, (field) => {
            const parts = field.split(concatenator);
            if (parts.length <= 1) {
                return field;
            }
            const [functionName, fieldName, alias, ...rest] = parts;
            return [
                (0, sequelize_1.fn)(functionName, (0, sequelize_1.col)(fieldName), ...rest),
                alias ?? (fieldName !== constants.fieldAllIndicator ? fieldName : functionName)
            ];
        });
        result.fields =
            fields && fields.length === 1 && fields[0] === constants.fieldAllIndicator ? null : fields;
    }
    return result;
};
exports.parseFields = parseFields;
