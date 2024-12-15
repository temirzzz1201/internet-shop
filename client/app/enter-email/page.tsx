'use client';
import {
  FormControl,
  FormLabel,
  Button,
  Box,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { sendEmailToResetPassword } from '@/actions/clientActions';
import AppContainer from '@/components/app-container';
import { ResetPasswordError } from '@/types';
import { useInfoMessage } from '@/utils/toastHelper';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Введите корректный email')
    .required('Email обязателен'),
});

function ForgotPassword() {
  const dispatch = useAppDispatch();
  const showInfoMessage = useInfoMessage();

  const handleForgotPassword = async (email: string) => {
    try {
      const data = await dispatch(sendEmailToResetPassword(email));
      showInfoMessage(
        'top',
        'Успешно!',
        'success',
        data.payload.message || 'Ссылка для сброса пароля отправлена на почту.'
      );
    } catch (error) {
      const err = error as ResetPasswordError;
      showInfoMessage(
        'top',
        'Ошибка!',
        'error',
        err.message || 'Не удалось отправить ссылку для сброса пароля.'
      );
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
