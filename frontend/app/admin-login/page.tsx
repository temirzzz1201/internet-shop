'use client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { login } from '@/actions/clientActions';
import { useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Button,
  Text,
  FormHelperText,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IFormValues } from '@/types';

const SignupSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('password is required'),
  email: Yup.string().email('Invalid email').required('email is required'),
});

export default function AdminLogin() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector((store) => store.auth);

  const handleSubmit = (email: string, password: string) => {
    dispatch(login({ email, password }));
  }

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     if (user?.role === 'admin') {
  //       redirect('/admin-page');
  //     } else {
  //       redirect('/');
  //     }
  //   }
  // }, [isAuthenticated, user]);


  return (
    <div className="container min-h-screen">
      <section className="p-3 flex mb-10">
        <Text color="blue.600" fontSize="2xl">
          Admin authorization
        </Text>
      </section>
      <section className="p-3 flex flex-col justify-center items-center">
        <FormControl className="max-w-[500px]">
          <FormLabel fontSize="24px" mb="5" color="blue.600">Please authorize</FormLabel>
          <Formik<IFormValues>
            initialValues={{ email: '', password: '' }}
            validationSchema={SignupSchema}
            onSubmit={({ email, password }) => {
              handleSubmit(email, password);
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
                  placeholder="email"
                />
                <small className='text-red-700'>{errors.email && touched.email && errors.email}</small>
                <Field
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="border rounded-sm mb-4 h-10 p-1"
                  placeholder="password"
                />
                <small className='text-red-700'>{errors.password && touched.password && errors.password}</small>
                <Button
                  mt={4}
                  isLoading={isLoading}
                  loadingText='Submitting'
                  colorScheme='teal'
                  variant='outline'
                  type="submit"
                >
                  Login
                </Button>
                <FormHelperText>
                  Don't registered yet?{' '}
                  <Link className="underline" href="/registration">
                    authorisation
                  </Link>
                </FormHelperText>
              </Form>
            )}
          </Formik>
        </FormControl>
      </section>
    </div>
  );
}
