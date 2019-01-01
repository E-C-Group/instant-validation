import { buildInitialState, findDifference, getErrorMessages, getRuleIdsInFields, isStateValid, showAllErrors, validateFieldsByDiff } from './modules';
/**
 * Quck setup. No Dependencies. Framework agnostic validation tool
 * It was created based on react-validation-tools library,
 * Thanks to ideas and participating from
 * @author Chernenko Alexander <ca@nullgr.com>, <akazimirkas@gmail.com>
 * @author Yurii Fediv <y.fediv@nullgr.com>
 * @author Michael Naskromnkiuk <m.naskromniuk@nullgr.com>
 * @author Igor Ivanov <i.ivanov@nullgr.com>
 */
var Validator = /** @class */ (function () {
    function Validator(fields) {
        if (typeof fields !== 'object') {
            throw new Error('Invalid fields parameter for fields, must be object');
        }
        this.validationDescription = fields;
        this.ruleIdsInFields = getRuleIdsInFields(fields);
        this.validationState = {};
        this.isInitValidationStateSet = false;
        this.insertedArgs = {};
    }
    Validator.prototype.setInitialValues = function (componentState) {
        if (this.isInitValidationStateSet) {
            return;
        }
        this.isInitValidationStateSet = true;
        this.refreshState(buildInitialState(componentState, this.validationDescription, this.insertedArgs, this.ruleIdsInFields));
    };
    Validator.prototype.validate = function (componentState) {
        if (!this.isInitValidationStateSet) {
            this.setInitialValues(componentState);
            return {
                errors: getErrorMessages(this.validationState, this.validationDescription)
            };
        }
        var diff = findDifference(componentState, this.validationState);
        if (Object.keys(diff).length > 0) {
            this.refreshState(validateFieldsByDiff(diff, this.validationState, this.validationDescription, true, this.insertedArgs, this.ruleIdsInFields));
        }
        return {
            errors: getErrorMessages(this.validationState, this.validationDescription)
        };
    };
    Validator.prototype.isFormValid = function () {
        return isStateValid(this.validationState);
    };
    Validator.prototype.insertArgs = function (args) {
        this.insertedArgs = args;
        return this;
    };
    Validator.prototype.showAllErrors = function (show) {
        if (show === void 0) { show = true; }
        this.refreshState(showAllErrors(this.validationState, show));
    };
    Validator.prototype.refreshState = function (validationState) {
        this.validationState = validationState;
    };
    return Validator;
}());
export default Validator;
