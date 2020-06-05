import { FormattedFieldsDescription, InsertedArgs, ValidationState } from '../types';
declare function buildInitialState<ComponentState>(componentState: ComponentState, validationDescription: FormattedFieldsDescription, insertedArgs: InsertedArgs, ruleIdsInFields: any): ValidationState<ComponentState>;
export { buildInitialState };
