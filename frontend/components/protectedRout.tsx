import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const accessToken = Cookies.get('accessToken');

    useEffect(() => {
      if (!accessToken) {
        redirect('/login');
      }
    }, [accessToken]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
