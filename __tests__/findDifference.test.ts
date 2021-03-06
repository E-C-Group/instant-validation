import { findDifference } from '../src/validator/modules';
import { ChangedArgsFields, ValidationState } from '../src/validator/types';

describe('Unit tests for findDifference module', () => {
  test(`Testing initial state run`, () => {
    interface ComponentState {
      email: string;
      password: string;
      message?: string;
    }
    const validationState: ValidationState<ComponentState> = {
      email: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false
      },
      password: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false
      }
    };
    const initialState = {
      email: '',
      password: ''
    };
    const updatedArgsFields: ChangedArgsFields = [];
    const expectedNextDifference = {};
    const difference = findDifference(
      initialState,
      validationState,
      updatedArgsFields
    );
    expect(difference).toEqual(expectedNextDifference);
  });

  test(`Testing one field state change run`, () => {
    const validationState = {
      email: {
        value: '',
        showError: false,
        statuses: [false],
        touched: true
      },
      password: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false
      }
    };
    const nextState = {
      email: 'a',
      password: ''
    };
    const updatedArgsFields: ChangedArgsFields = [];
    const expectedNextDifference = {
      email: 'a'
    };

    const difference = findDifference(
      nextState,
      validationState,
      updatedArgsFields
    );
    expect(difference).toEqual(expectedNextDifference);
  });

  test(`Testing two fields state change run`, () => {
    const validationState = {
      email: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false
      },
      password: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false
      }
    };
    const nextState = {
      email: 'someMail@mail.com',
      password: 'somepassword'
    };
    const updatedArgsFields: ChangedArgsFields = [];

    const expectedNextDifference = {
      email: 'someMail@mail.com',
      password: 'somepassword'
    };

    const difference = findDifference(
      nextState,
      validationState,
      updatedArgsFields
    );
    expect(difference).toEqual(expectedNextDifference);
  });

  test(`Testing extended state run`, () => {
    interface ComponentState {
      email: string;
      password: string;
      message?: string;
    }
    const validationState: ValidationState<ComponentState> = {
      email: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false
      },
      password: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false
      }
    };
    const updatedArgsFields: ChangedArgsFields = [];
    const extendedState = {
      email: '',
      password: '',
      message: 'no need to validate'
    };

    const difference = findDifference(
      extendedState,
      validationState,
      updatedArgsFields
    );
    expect(difference).toEqual({});
  });

  test(`Testing inserted arguments update`, () => {
    const validationState = {
      email: {
        value: '',
        showError: false,
        statuses: [false],
        touched: true
      },
      password: {
        value: '',
        showError: false,
        statuses: [false],
        touched: false
      }
    };
    const nextState = {
      email: '',
      password: ''
    };
    const updatedArgsFields: ChangedArgsFields = ['email'];
    const expectedNextDifference = {
      email: ''
    };

    const difference = findDifference(
      nextState,
      validationState,
      updatedArgsFields
    );
    expect(difference).toEqual(expectedNextDifference);
  });
});
