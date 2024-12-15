'use client';
import Link from 'next/link';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { register } from '@/actions/clientActions';
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
  username: Yup.string()
    .min(4, 'Слишком короткое имя')
    .max(50, 'Слишком длинное имя')
    .required('Имя обязательно'),
  password: Yup.string()
    .min(8, 'Пароль должен сосотоять из 8 символов минимум')
    .required('Пароль обязателен'),
  email: Yup.string().email('Неправильный email').required('email обязателен'),
});

export default function Register() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((store) => store.auth);
  const { replace } = useRouter();
  const showInfoMessage = useInfoMessage();

  return (
    <AppContainer myClass="justify-center">
      <FormControl className="max-w-[500px]">
        <FormLabel fontSize="24px" mb="5" color="blue.600">
          Пожалуйста зарегестрируйтесь
        </FormLabel>
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          validationSchema={SignupSchema}
          onSubmit={(values: IFormValues) => {
            dispatch(register(values))
              .then((val) => {
                // @ts-ignore: can be undefined
                const username = val?.payload?.user?.username;
                if (username) {
                  showInfoMessage(
                    'top',
                    `Вы успешно зарегестрировались, ${username}!\n
                    Пожалуйста авторизуйтесь
                    `,
                    'success'
                  );
                  replace('/login');
                } else {
                  // @ts-ignore: error oblect problem
                  showInfoMessage('top', error, 'error');
                }
              })
              .catch((error) => {
                showInfoMessage(
                  'top',
                  error.payload || 'Упс... Что-то пошло не так!',
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
                type="text"
                name="username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                className="border rounded-sm mb-2 h-10 p-1"
                placeholder="Имя"
              />
              <small className="text-red-700">
                {errors.username && touched.username && errors.username}
              </small>
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
                className="border rounded-sm mb-2 h-10 p-1"
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
                Зарегистрироваться
              </Button>
              <FormHelperText>
                Есть аккаунт?{' '}
                <Link className="underline" href="/login">
                  Авторизация
                </Link>
              </FormHelperText>
            </Form>
          )}
        </Formik>
      </FormControl>
    </AppContainer>
  );
}
