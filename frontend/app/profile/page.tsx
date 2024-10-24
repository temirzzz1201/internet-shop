'use client';
import { Box } from '@chakra-ui/react';
import AppContainer from '@/components/app-container';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { capitalize } from '@/utils/capitalize';
import { getGreetingByTime } from '@/utils/dateHelper';

function Profile() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = Cookies.get('user');
    if (name) {
      const userNameFromCookie = JSON.parse(name);
      setUserName(capitalize(userNameFromCookie.username));
    }
  }, []);

  return (
    <AppContainer
      title={` ${getGreetingByTime()}, ${userName} `}
      myClass="justify-start"
    >
      <Box as="aside" mr="80px"></Box>
    </AppContainer>
  );
}

export default Profile;
