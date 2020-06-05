import { ErrorMessages, FormattedFieldsDescription, ValidationState } from '../types';
declare function getErrorMessages<ComponentState>(validationState: ValidationState<ComponentState>, validationDescription: FormattedFieldsDescription): ErrorMessages<ComponentState>;
export { getErrorMessages };
