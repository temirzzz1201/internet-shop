'use client';

import { useAppSelector } from '@/hooks/useAppSelector';

function Profile() {
  const { user } = useAppSelector((store) => store.auth);

  console.log('User from Redux store:', user);

  return (
    <div>
      <h1>Welcome, {user?.username || 'Guest'}</h1>
      <p>This is your profile page</p>
    </div>
  );
}

export default Profile;
