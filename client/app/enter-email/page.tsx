'use client';
import {
  FormControl,
  FormLabel,
  Button,
  Box,
  Input,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { sendEmailToResetPassword } from '@/actions/clientActions';
import AppContainer from '@/components/app-container';
import { ResetPasswordError } from '@/types';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Введите корректный email')
    .required('Email обязателен'),
});

function ForgotPassword() {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const handleForgotPassword = async (email: string) => {
    try {
      const data = await dispatch(sendEmailToResetPassword(email));
      toast({
        position: 'top',
        title: 'Успешно!',
        description:
          data.payload.message ||
          'Ссылка для сброса пароля отправлена на почту.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const err = error as ResetPasswordError;
      toast({
        position: 'top',
        title: 'Ошибка',
        description:
          err.message || 'Не удалось отправить ссылку для сброса пароля.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <AppContainer title="Восстановление пароля" myClass="flex justify-center">
      <Box maxWidth="500px" width="100%">
        <FormControl mb={4}>
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleForgotPassword(values.email).finally(() =>
                setSubmitting(false)
              );
            }}
          >
            {({ errors, isSubmitting }) => (
              <Form>
                <FormLabel htmlFor="email">Эл. почта</FormLabel>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Введите email"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
                <Button
                  mt={4}
                  isLoading={isSubmitting}
                  colorScheme="teal"
                  type="submit"
                  width="full"
                >
                  Отправить
                </Button>
              </Form>
            )}
          </Formik>
        </FormControl>
      </Box>
    </AppContainer>
  );
}

export default ForgotPassword;
