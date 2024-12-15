'use client';
import Link from 'next/link';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { login } from '@/actions/clientActions';
import { useRouter } from 'next/navigation';
import {
  FormControl,
  FormLabel,
  Button,
  FormHelperText,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IFormValues } from '@/types';
import AppContainer from '@/components/app-container';
import { useInfoMessage } from '@/utils/toastHelper';

const SignupSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Пароль должен сосотоять из 8 символов минимум')
    .required('Пароль обязателен'),
  email: Yup.string().email('Неправильный email').required('email обязателен'),
});

export default function Login() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((store) => store.auth);
  const { replace } = useRouter();
  const showInfoMessage = useInfoMessage();
  

  return (
    <AppContainer myClass="justify-center">
      <FormControl className="max-w-[500px]">
        <FormLabel fontSize="24px" mb="5" color="blue.600">
          Пожалуйста авторизуйтесь
        </FormLabel>
        <Formik<IFormValues>
          initialValues={{ email: '', password: '' }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            dispatch(login(values))
              .then((val) => {
                // @ts-ignore: can be undefined
                const username = val?.payload?.user?.username;
                if (username) {
                   showInfoMessage(
                     'top',
                     `Добро пожаловать ${username}`,
                     'success'
                   );
                  replace('/');
                } else {
                   showInfoMessage('top', 'Нет такого пользователя!', 'error');
                }
              })
              .catch(() => {
                   showInfoMessage(
                     'top',
                     'Упс... Что то пошло не так!',
                     'error'
                   );
              });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col">
              <Field
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                className="border rounded-sm mb-2 h-10 p-1"
                placeholder="Эл.почта"
              />
              <small className="text-red-700">
                {errors.email && touched.email && errors.email}
              </small>
              <Field
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                className="border rounded-sm mb-4 h-10 p-1"
                placeholder="Пароль"
              />
              <small className="text-red-700">
                {errors.password && touched.password && errors.password}
              </small>
              <Button
                mt="4"
                mb="3"
                isLoading={isLoading}
                loadingText="Submitting"
                colorScheme="teal"
                variant="outline"
                type="submit"
                width="210px"
                sx={{
                  '@media (max-width: 360px)': {
                    width: '100%',
                  },
                }}
              >
                Войти
              </Button>
              <FormHelperText mb="5">
                Еще не зарегестрированы?{' '}
                <Link className="underline" href="/registration">
                  Регистрация
                </Link>
              </FormHelperText>
              <FormHelperText>
                Забыли пароль?{' '}
                <Link className="underline" href="/enter-email">
                  Восстановить
                </Link>
              </FormHelperText>
            </Form>
          )}
        </Formik>
      </FormControl>
    </AppContainer>
  );
}
