import axios from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Произошла ошибка';
  }
  return 'Произошла ошибка';
};
