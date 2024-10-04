'use client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { register } from '@/actions/clientActions';
import { FormControl, FormLabel, Button, Text, FormHelperText } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    // .min(6, 'Too Short!')
    // .max(50, 'Too Long!')
    // .required('Required'),
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  email: Yup.string().email('Invalid email').required('Required'),
});


export default function Register() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(store => store.auth)
  console.log(user);

  console.log(isAuthenticated);
  if (isAuthenticated) {
    redirect('/login')
  }


  return (
    <div className="container min-h-screen">
      <section className="p-3 flex mb-10">
        <Text color="blue.600" fontSize="2xl">Registration page</Text>
      </section>
      <section className="p-3 flex flex-col justify-center items-center">
        <FormControl className="max-w-[500px]">
          <FormLabel>Registration</FormLabel>
          <Formik
            initialValues={{ username: '', email: '', password: '' }}
            validationSchema={SignupSchema}
            validate={values => {
              const errors = {} as any;
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
              if (!values) {
                alert('All fields are required');
                return;
              }

              console.log('values ', values);

              dispatch(register(values));
              values.username = ''
              values.email = ''
              values.password = ''

            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              /* and other goodies */
            }) => (
              <Form onSubmit={handleSubmit} className='flex flex-col'>
                <Field
                  type="text"
                  name="username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  className='border rounded-sm mb-2 h-10 p-1'
                  placeholder='name'
                />
                {/* {errors.name && touched.name && errors.name} */}
                {errors.username && touched.username ? (
                  <div>{errors.username}</div>
                ) : null}
                <Field
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className='border rounded-sm mb-2 h-10 p-1'
                  placeholder='email'
                />
                {errors.email && touched.email && errors.email}
                <Field
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className='border rounded-sm mb-4 h-10 p-1'
                  placeholder='password'
                />
                {errors.password && touched.password && errors.password}
                <Button mt={4} colorScheme="teal" className='items-start w-[120px] mb-7' type="submit">
                  Submit
                </Button>
                <FormHelperText>
                  Have an account? <Link className="underline" href="/login">Login</Link>
                </FormHelperText>
              </Form>

            )}

          </Formik>
        </FormControl>
      </section>
    </div>
  )
}


