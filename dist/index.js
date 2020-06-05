'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function findDifference(componentStateUpdates, actualValidationState, updatedArgsField) {
    console.log('actualValidationState', actualValidationState);
    var difference = Object.keys(actualValidationState).reduce(function (acc, fieldName) {
        if (typeof componentStateUpdates[fieldName] === 'undefined' ||
            componentStateUpdates[fieldName] ===
                actualValidationState[fieldName].value) {
            return acc;
        }
        acc[fieldName] = componentStateUpdates[fieldName];
        return acc;
    }, {});
    var argsDifference = updatedArgsField.reduce(function (acc, fieldName) {
        acc[fieldName] = componentStateUpdates[fieldName];
        return acc;
    }, {});
    return __assign({}, difference, argsDifference);
}

// TODO add tests here
function validateField(fieldValue, fieldRules, insertedArgs) {
    return fieldRules.map(function (item) {
        var insert = [];
        if (item.ruleId && insertedArgs[item.ruleId]) {
            insert = insertedArgs[item.ruleId].slice();
        }
        return item.rule.apply(item, [fieldValue].concat(insert));
    });
}

function validateFieldsByDiff(newDiff, oldValidationState, validationDescription, touched, insertedArgs, ruleIdsInFields) {
    // validate fields by diff
    var newValidationState = Object.keys(newDiff).reduce(function (acc, fieldName) {
        var validatedStatuses = validateField(newDiff[fieldName], validationDescription[fieldName], insertedArgs);
        acc[fieldName] = {
            showError: touched,
            value: newDiff[fieldName],
            statuses: validatedStatuses,
            touched: touched
        };
        return acc;
    }, __assign({}, oldValidationState));
    // validate fields, that uses additional arguments
    Object.keys(insertedArgs).forEach(function (arg) {
        if (!ruleIdsInFields[arg]) {
            return;
        }
        ruleIdsInFields[arg].forEach(function (field) {
            if (newDiff[field]) {
                return;
            }
            var validatedStatuses = validateField(newValidationState[field].value, validationDescription[field], insertedArgs);
            newValidationState[field] = __assign({}, newValidationState[field], { statuses: validatedStatuses });
        });
    });
    return newValidationState;
}

function buildInitialState(componentState, validationDescription, insertedArgs, ruleIdsInFields) {
    var initialDiff = {};
    var initialState = {};
    Object.keys(validationDescription).forEach(function (fieldName) {
        if (typeof componentState[fieldName] === 'undefined') {
            throw new Error("It seems that you didn't passed a field '" + fieldName + "' value");
        }
        initialDiff[fieldName] = componentState[fieldName];
        initialState[fieldName] = {
            value: componentState[fieldName],
            showError: false,
            touched: false,
            statuses: []
        };
    });
    return validateFieldsByDiff(initialDiff, initialState, validationDescription, false, insertedArgs, ruleIdsInFields);
}

function findFirstFailedRuleMessage(fieldDescripton, statuses) {
    var searchIndex = statuses.indexOf(false);
    return searchIndex === -1 ? '' : fieldDescripton[searchIndex].message;
}
// TODO add tests here
function getErrorMessages(validationState, validationDescription) {
    return Object.keys(validationState).reduce(function (acc, fieldName) {
        acc[fieldName] = validationState[fieldName].showError
            ? findFirstFailedRuleMessage(validationDescription[fieldName], validationState[fieldName].statuses)
            : '';
        return acc;
    }, {});
}

// TODO add tests here
function isStateValid(validationState) {
    var keys = Object.keys(validationState);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var item = validationState[key];
        if (item.statuses.filter(function (status) { return !status; }).length > 0) {
            return false;
        }
    }
    return true;
}

// TODO add tests here
// build a hashmap ruleIds -> filedNames array, where those ids are used
function getRuleIdsInFields(fields) {
    var result = {};
    Object.keys(fields).forEach(function (field) {
        fields[field].forEach(function (rule) {
            if (rule.ruleId) {
                if (result[rule.ruleId] &&
                    result[rule.ruleId].filter(function (f) { return f === field; }).length === 0) {
                    // if this ruleId is used in multiple fields
                    return (result[rule.ruleId] = result[rule.ruleId].concat([field]));
                }
                // if this ruleId is used only in one field
                return (result[rule.ruleId] = [field]);
            }
            return;
        });
    });
    return result;
}

function showAllErrors(validationState, show) {
    return Object.keys(validationState).reduce(function (acc, key) {
        acc[key] = __assign({}, validationState[key], { showError: show });
        return acc;
    }, {});
}

function getFieldsData(validationState) {
    // TODO add README desctiption and example for it
    return Object.keys(validationState).reduce(function (acc, key) {
        acc[key] = __assign({}, validationState[key], { valid: validationState[key].statuses.filter(function (status) { return !status; })
                .length === 0 });
        return acc;
    }, {});
}

function findArgsDifference(newArguments, insertedArgs, ruleIdsInFields) {
    return Object.keys(newArguments).reduce(function (updatedArgs, key) {
        newArguments[key].forEach(function (newArg, index) {
            if (insertedArgs[key][index] !== newArg) {
                updatedArgs = updatedArgs.concat(ruleIdsInFields[key]);
            }
        });
        return updatedArgs;
    }, []);
}

/**
 * Quck setup. No Dependencies. Framework agnostic validation tool
 * It was created based on react-validation-tools library,
 * Thanks to ideas and participating from
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Stanislav Iliashchuk <s.iliashchuk@nullgr.com>
 * @author Roman Charugin <i@charugin.ru>
 * @author Igor Ivanov <i.ivanov@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 */
var Validator = /** @class */ (function () {
    function Validator(fields) {
        if (typeof fields !== 'object') {
            throw new Error('Invalid fields parameter for fields, must be object');
        }
        this.validationDescription = fields;
        this.ruleIdsInFields = getRuleIdsInFields(fields);
        this.isInitValidationStateSet = false;
        this.updatedArgsFields = [];
        this.insertedArgs = {};
    }
    Validator.prototype.setInitialValues = function (componentState) {
        console.log('setInitialValues', componentState);
        if (this.isInitValidationStateSet) {
            return;
        }
        this.isInitValidationStateSet = true;
        this.refreshState(buildInitialState(componentState, this.validationDescription, this.insertedArgs, this.ruleIdsInFields));
    };
    Validator.prototype.validate = function (componentState) {
        console.log('validate', componentState);
        if (!this.isInitValidationStateSet) {
            this.setInitialValues(componentState);
            var initialState_1 = this.validationState;
            return {
                errors: getErrorMessages(initialState_1, this.validationDescription),
                get fields() {
                    return getFieldsData(initialState_1);
                }
            };
        }
        var diff = findDifference(componentState, this.validationState, this.updatedArgsFields);
        if (Object.keys(diff).length > 0) {
            this.refreshState(validateFieldsByDiff(diff, this.validationState, this.validationDescription, true, this.insertedArgs, this.ruleIdsInFields));
        }
        var updatedState = this.validationState;
        return {
            errors: getErrorMessages(updatedState, this.validationDescription),
            get fields() {
                return getFieldsData(updatedState);
            }
        };
    };
    Validator.prototype.isFormValid = function () {
        return isStateValid(this.validationState);
    };
    Validator.prototype.insertArgs = function (args) {
        if (Object.keys(this.insertedArgs).length > 0) {
            this.updatedArgsFields = findArgsDifference(args, this.insertedArgs, this.ruleIdsInFields);
        }
        this.insertedArgs = args;
        return this;
    };
    Validator.prototype.showAllErrors = function (show) {
        if (show === void 0) { show = true; }
        this.refreshState(showAllErrors(this.validationState, show));
    };
    Validator.prototype.refreshState = function (validationState) {
        console.log('refreshState', validationState);
        this.validationState = validationState;
    };
    return Validator;
}());

// Represents Public API of library, every method presented there
// may be used by user and should be described in README file
//
// Separating of Public Api and Validator gives next benefits:
//  1) User of library have access only to Public API but not to implementation details
//  2) At the same time inner details of Validator are easy testable
//  3) Also small benefit: in Validator we declare methods on prototype, but not on actual function -
//     this is useful for reducing of initial render time,
//     if project have a lot of forms(therefore a lot of instances of Validator object)
var ValidationPublicApi = function (fields) {
    var validator = new Validator(fields);
    this.setInitialValues = function (componentState) {
        return validator.setInitialValues(componentState);
    };
    this.validate = function (componentState) {
        return validator.validate(componentState);
    };
    this.isFormValid = function () {
        return validator.isFormValid();
    };
    this.insertArgs = function (args) {
        return validator.insertArgs(args);
    };
    this.showAllErrors = function (show) {
        return validator.showAllErrors(show);
    };
};

module.exports = ValidationPublicApi;
