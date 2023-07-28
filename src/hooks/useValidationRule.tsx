import { useCallback, useEffect, useState } from 'react';
import { IOneDelegatees } from '../interfaces/user.interface';

type ValidationRule = (value: number) => string | null;

export const useValidationRule = (initialValue: number, validationFunctions: ValidationRule[]) => {
  const [value, setValue] = useState<string | number>(initialValue);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [activeButton, setActiveButton] = useState<boolean>(false);

  const validate = useCallback((value: number) => {
    const newAlerts = validationFunctions
      .map((validateFunction) => validateFunction(value))
      .filter((result) => result !== null) as string[];
    
    setAlerts(newAlerts);
    setActiveButton(newAlerts.length === 0);
  }, [validationFunctions]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue(value);
    validate(Number(value));
  }, [validate]);

  return { value, alerts, handleChange, activeButton, setValue, validate };
}