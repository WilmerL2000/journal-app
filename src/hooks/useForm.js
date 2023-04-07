import { useEffect, useMemo, useState } from 'react';

export const useForm = (initialForm = {}, formValidations = {}) => {
  const [formState, setFormState] = useState(initialForm);
  const [formValidation, setFormValidation] = useState({});

  useEffect(() => {
    createValidators();
  }, [formState]);

  /* Checks if all the form fields are valid based on the validation rules provided in the `formValidations` object. 
  It does this by iterating over the `formValidation` object and checking if any of the values are not null. 
  The `useMemo` hook is used to memoize the value so that it only recomputes when the `formState` changes. */
  const isFormValid = useMemo(() => {
    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue] !== null) return false;
    }

    return true;
  }, [formValidation]);

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  /**
   * The function creates validator functions for each form field based on the validation rules
   * provided in the `formValidations` object.
   */
  const createValidators = () => {
    const formCheckValues = {};

    for (const formField of Object.keys(formValidations)) {
      const [fn, errorMessage = 'Este campo es requerido'] =
        formValidations[formField];

      /* This line of code is creating a validator function for each form field based on the validation rules
      provided in the `formValidations` object. */
      formCheckValues[`${formField}Valid`] = fn(formState[formField])
        ? null
        : errorMessage;
    }

    setFormValidation(formCheckValues);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    ...formValidation,
    isFormValid,
  };
};
