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
import { resetPasswordHandler } from '@/actions/clientActions';
import AppContainer from '@/components/app-container';
import { useInfoMessage } from '@/utils/toastHelper';

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .required('Пароль обязателен'),
});

function ResetPassword({ params }: { params: { token: string } }) {
  const { token } = params;
  const dispatch = useAppDispatch();
  const showInfoMessage = useInfoMessage();

  const handleResetPassword = async (password: string) => {
    try {
      await dispatch(resetPasswordHandler({ token, password })).unwrap();
      showInfoMessage('top', 'Успешно', 'success');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      showInfoMessage('top', 'Ошибка', 'error', errorMessage);
    }
  };

  return (
    <AppContainer title="Сброс пароля" myClass="flex justify-center">
      <Box maxWidth="500px" width="100%">
        <FormControl mb={4}>
          <Formik
            initialValues={{ password: '' }}
            validationSchema={ResetPasswordSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleResetPassword(values.password).finally(() =>
                setSubmitting(false)
              );
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <FormLabel htmlFor="password">Новый пароль</FormLabel>
                <Field
                  as={Input}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Введите новый пароль"
                />
                {touched.password && errors.password && (
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                )}
                <Button
                  mt={4}
                  isLoading={isSubmitting}
                  colorScheme="teal"
                  type="submit"
                  width="full"
                >
                  Сбросить пароль
                </Button>
              </Form>
            )}
          </Formik>
        </FormControl>
      </Box>
    </AppContainer>
  );
}

export default ResetPassword;
