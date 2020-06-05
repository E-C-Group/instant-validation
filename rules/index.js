"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredRule = function (value) { return !!value; };
exports.lengthRule = function (l) { return function (v) {
    return !!v && v.length >= l;
}; };
exports.minLengthRule = function (l) {
    return function (v) {
        return !!v && v.length >= l;
    };
};
exports.maxLengthRule = function (l) {
    return function (v) {
        return !!v && v.length <= l;
    };
};
