import { FieldsDescription, ValidateReturn } from './types';
interface ValidationPublicApi<State> {
    setInitialValues: (state: State) => State;
    validate(state: State): ValidateReturn;
    isFormValid(): boolean;
}
declare const ValidationPublicApi: new <State>(fields: FieldsDescription) => ValidationPublicApi<State>;
export default ValidationPublicApi;
