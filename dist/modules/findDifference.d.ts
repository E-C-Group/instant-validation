import { ChangedArgsFields, ValidationState } from '../types';
declare function findDifference<ComponentState>(componentStateUpdates: ComponentState, actualValidationState: ValidationState<ComponentState>, updatedArgsField: ChangedArgsFields): Partial<ComponentState>;
export { findDifference };
