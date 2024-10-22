'use client';
import Link from 'next/link';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { register } from '@/actions/clientActions';
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

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, 'Too Short!')
    .max(50, 'Too Long!')
    .required('name is required'),
  password: Yup.string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('password is required'),
  email: Yup.string().email('Invalid email').required('email is required'),
});

export default function Register() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((store) => store.auth);

  return (
    <AppContainer title='Registration page' myClass='justify-center'>
      <FormControl className="max-w-[500px]">
        <FormLabel fontSize="24px" mb="5" color="blue.600">Registration</FormLabel>
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          validationSchema={SignupSchema}
          onSubmit={(values: IFormValues) => {
            dispatch(register(values));
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
                placeholder="name"
              />
              <small className='text-red-700'>{errors.username && touched.username && errors.username}</small>
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
                Registration
              </Button>
              <FormHelperText>
                Have an account?{' '}
                <Link className="underline" href="/login">
                  Login
                </Link>
              </FormHelperText>
            </Form>
          )}
        </Formik>
      </FormControl>
    </AppContainer>
  );
}
