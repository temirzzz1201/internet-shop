import { useState } from 'react';
import { IUser } from '../types';

export function useForm<T extends IUser>(inputValues: T) {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return { values, handleChange, setValues };
}
