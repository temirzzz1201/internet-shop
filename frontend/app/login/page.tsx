'use client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { login } from '@/actions/clientActions';
import {
  FormControl,
  FormLabel,
  Button,
  Text,
  FormHelperText,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IFormValues, IFormErrors } from '@/types';


const SignupSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

export default function Login() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((store) => store.auth);

  if (isAuthenticated) {
    redirect('/');
  }

  return (
    <div className="container min-h-screen">
      <section className="p-3 flex mb-10">
        <Text color="blue.600" fontSize="2xl">
          Login page
        </Text>
      </section>
      <section className="p-3 flex flex-col justify-center items-center">
        <FormControl className="max-w-[500px]">
          <FormLabel>Please login</FormLabel>
          <Formik<IFormValues>
            initialValues={{ email: '', password: '' }}
            validationSchema={SignupSchema}
            validate={(values) => {
              const errors: IFormErrors = {};
              if (!values.email) {
                errors.email = 'Required';
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = 'Invalid email address';
              }
              return errors;
            }}
            onSubmit={(values) => {
              console.log('values ', values);
              dispatch(login(values));
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
                {errors.email && touched.email && errors.email}
                <Field
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="border rounded-sm mb-4 h-10 p-1"
                  placeholder="password"
                />
                {errors.password && touched.password && errors.password}
                <Button
                  mt={4}
                  colorScheme="teal"
                  className="items-start w-[120px] mb-7"
                  type="submit"
                >
                  Submit
                </Button>
                <FormHelperText>
                  Don't registered yet?{' '}
                  <Link className="underline" href="/registration">
                    Registration
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
