import Cookies from 'js-cookie';
import { useLayoutEffect } from 'react';
import { redirect } from 'next/navigation';
import React from 'react';

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthHOC = (props: P) => {
    const accessToken = Cookies.get('accessToken');

    useLayoutEffect(() => {
      if (!accessToken) {
        redirect('/login');
      }
    }, [accessToken]);

    return <WrappedComponent {...props} />;
  };

  AuthHOC.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthHOC;
};

export default withAuth;
