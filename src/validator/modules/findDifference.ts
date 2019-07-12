import { ValidationState } from '../types';

function findDifference<ComponentState>(
  componentStateUpdates: ComponentState,
  actualValidationState: ValidationState,
  updatedArgsField: string[]
): Partial<ComponentState> {
  const difference = Object.keys(actualValidationState).reduce((acc, fieldName) => {
    if (
      typeof componentStateUpdates[fieldName] === 'undefined' ||
      componentStateUpdates[fieldName] ===
        actualValidationState[fieldName].value
    ) {
      return acc;
    }

    acc[fieldName] = componentStateUpdates[fieldName];
    return acc;
  }, {});
  const argsDifference = updatedArgsField.reduce((acc, fieldName) => {
    acc[fieldName] = componentStateUpdates[fieldName];
    return acc;
  }, {});
  return {...difference, ...argsDifference};
}

export { findDifference };
