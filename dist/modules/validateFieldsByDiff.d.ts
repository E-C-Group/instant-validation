import { FormattedFieldsDescription, InsertedArgs, RuleIdsInFields, ValidationState } from '../types';
declare function validateFieldsByDiff<ComponentState>(newDiff: Partial<ComponentState>, oldValidationState: ValidationState<ComponentState>, validationDescription: FormattedFieldsDescription, touched: boolean, insertedArgs: InsertedArgs, ruleIdsInFields: RuleIdsInFields): ValidationState<ComponentState>;
export { validateFieldsByDiff };
