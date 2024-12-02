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
  useToast,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IFormValues } from '@/types';
import AppContainer from '@/components/app-container';

const SignupSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('password is required'),
  email: Yup.string().email('Invalid email').required('email is required'),
});

export default function Login() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((store) => store.auth);
  const toast = useToast();
  const { replace } = useRouter();

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
                  toast({
                    position: 'top',
                    title: `Добро пожаловать ${username}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: false,
                  });
                  replace('/');
                } else {
                  toast({
                    position: 'top',
                    title: 'Нет такого пользователя!',
                    status: 'error',
                    duration: 3000,
                    isClosable: false,
                  });
                }
              })
              .catch(() => {
                toast({
                  position: 'top',
                  title: 'Упс... Что то пошло не так!',
                  status: 'error',
                  duration: 3000,
                  isClosable: false,
                });
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
                mt={4}
                isLoading={isLoading}
                loadingText="Submitting"
                colorScheme="teal"
                variant="outline"
                type="submit"
              >
                Войти
              </Button>
              <FormHelperText>
                Еще не зарегестрированы?{' '}
                <Link className="underline" href="/registration">
                  Регистрация
                </Link>
              </FormHelperText>
            </Form>
          )}
        </Formik>
      </FormControl>
    </AppContainer>
  );
}
