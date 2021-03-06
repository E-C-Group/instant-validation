import {
  FormattedFieldsDescription,
  InsertedArgs,
  RuleIdsInFields,
  ValidationState
} from '../types';
import { validateField } from './validateField';
function validateFieldsByDiff<ComponentState>(
  newDiff: Partial<ComponentState>,
  oldValidationState: ValidationState<ComponentState>,
  validationDescription: FormattedFieldsDescription,
  touched: boolean,
  insertedArgs: InsertedArgs,
  ruleIdsInFields: RuleIdsInFields
): ValidationState<ComponentState> {
  // validate fields by diff
  const newValidationState = Object.keys(newDiff).reduce(
    (acc, fieldName) => {
      const validatedStatuses = validateField(
        newDiff[fieldName],
        validationDescription[fieldName],
        insertedArgs
      );
      acc[fieldName] = {
        showError: touched,
        value: newDiff[fieldName],
        statuses: validatedStatuses,
        touched
      };
      return acc;
    },
    { ...(oldValidationState as object) }
  );

  // validate fields, that uses additional arguments
  Object.keys(insertedArgs).forEach(arg => {
    if (!ruleIdsInFields[arg]) {
      return;
    }
    ruleIdsInFields[arg].forEach(field => {
      if (newDiff[field]) {
        return;
      }

      const validatedStatuses = validateField(
        newValidationState[field].value,
        validationDescription[field],
        insertedArgs
      );
      newValidationState[field] = {
        ...newValidationState[field],
        statuses: validatedStatuses
      };
    });
  });
  return newValidationState as ValidationState<ComponentState>;
}
export { validateFieldsByDiff };
