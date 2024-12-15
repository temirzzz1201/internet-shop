import { useToast } from '@chakra-ui/react';

export const useInfoMessage = () => {
  const toast = useToast();

  return (
    position: 'top' | 'bottom',
    title: string,
    status: 'info' | 'warning' | 'success' | 'error' | 'loading',
    description?: string
  ) => {
    toast({
      position: position,
      title,
      description,
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };
};
