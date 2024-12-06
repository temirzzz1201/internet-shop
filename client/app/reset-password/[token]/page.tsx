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
import { resetPasswordHandler } from '@/actions/clientActions';
import AppContainer from '@/components/app-container';

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .required('Пароль обязателен'),
});

function ResetPassword({ params }: { params: { token: string } }) {
  const { token } = params;
  const dispatch = useAppDispatch();
  const toast = useToast();

  const handleResetPassword = async (password: string) => {
    try {
      const response = await dispatch(
        resetPasswordHandler({ token, password })
      ).unwrap();

      toast({
        title: 'Успешно!',
        description: response.message || 'Пароль успешно сброшен.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast({
        title: 'Ошибка',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
