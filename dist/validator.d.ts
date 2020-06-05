import { ChangedArgsFields, ErrorMessages, FieldsDescription, FormattedFieldsDescription, InsertedArgs, RuleIdsInFields, ValidateReturn, ValidationState } from './types';
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
declare class Validator<ComponentState> {
    errors?: ErrorMessages<ComponentState>;
    validationDescription: FormattedFieldsDescription;
    validationState?: ValidationState<ComponentState>;
    isInitValidationStateSet: boolean;
    insertedArgs: InsertedArgs;
    updatedArgsFields: ChangedArgsFields;
    ruleIdsInFields: RuleIdsInFields;
    constructor(fields: FieldsDescription);
    setInitialValues(componentState: ComponentState): void;
    validate(componentState: ComponentState): ValidateReturn<ComponentState>;
    isFormValid(): boolean;
    insertArgs(args: InsertedArgs): Validator<ComponentState>;
    showAllErrors(show?: boolean): void;
    private refreshState;
}
export default Validator;
