'use client';

import { useAppSelector } from '@/hooks/useAppSelector';
import withAuth from '@/components/protectedRout';

function Profile() {
  const { user } = useAppSelector((store) => store.auth);

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <p>This is your profile page</p>
    </div>
  );
}

export default withAuth(Profile);
