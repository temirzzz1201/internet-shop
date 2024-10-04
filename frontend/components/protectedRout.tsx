import Cookies from 'js-cookie';
import { useLayoutEffect } from 'react';
import { redirect } from 'next/navigation';

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const accessToken = Cookies.get('accessToken');

    useLayoutEffect(() => {
      if (!accessToken) {
        redirect('/login');
      }
    }, [accessToken]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
