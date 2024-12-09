'use client';
import { Box, Text, VStack, Image, Divider, Heading } from '@chakra-ui/react';
import AppContainer from '@/components/app-container';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { capitalize } from '@/utils/capitalize';
import { getGreetingByTime } from '@/utils/dateHelper';
import { getUserOrders } from '@/actions/clientActions';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { IOrder } from '@/types';

function Profile() {
  const [userName, setUserName] = useState('');
  const [userOrders, setUserOrders] = useState<IOrder[]>([]);
  const dispatch = useAppDispatch();

  const getUserOrderHandler = async (id: string) => {
    try {
      const action = await dispatch(getUserOrders(id));
      if (action.meta.requestStatus === 'fulfilled') {
        const payload = action.payload;

        if (Array.isArray(payload)) {
          setUserOrders(payload as IOrder[]);
        } else {
          console.error('Unexpected payload format:', payload);
        }
      } else {
        console.error('Error fetching user orders:', action.payload);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  /* eslint-disable */
  useEffect(() => {
    const name = Cookies.get('user');
    if (name) {
      const userNameFromCookie = JSON.parse(name);
      const userId = userNameFromCookie.id;
      setUserName(capitalize(userNameFromCookie.username));
      getUserOrderHandler(userId);
    }
  }, []);

  return (
    <AppContainer
      title={` ${getGreetingByTime()}, ${userName} `}
      myClass="flex-col"
    >
      <Heading mb="35px" size="lg">
        История заказов
      </Heading>
      <Box as="section">
        <VStack spacing={4} align="stretch">
          {userOrders.length === 0 ? (
            <Text>У вас нет заказов.</Text>
          ) : (
            userOrders.map((order) => (
              <Box
                key={order.id}
                p="4"
                borderWidth="1px"
                borderRadius="lg"
                w="full"
                shadow="md"
              >
                <Text fontWeight="bold" mb="2">
                  Заказ №: {order.id}
                </Text>
                <VStack spacing={2} align="start">
                  <Box
                    mb="3"
                    display="flex"
                    flexWrap="wrap"
                    gap="2"
                    justifyContent={{ base: 'center', md: 'flex-start' }}
                  >
                    {order.Product &&
                      order.Product.images &&
                      order.Product.images.length > 0 &&
                      order.Product.images.map((image) => {
                        const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${image.imageUrl}`;
                        return (
                          <Image
                            key={image.imageUrl}
                            src={imageUrl}
                            alt={order?.Product?.name}
                            boxSize="120px"
                            objectFit="cover"
                          />
                        );
                      })}
                  </Box>
                </VStack>

                <Divider my="4" />

                {order.Product ? (
                  <>
                    {order.Product.name && (
                      <Box mb="4">
                        <Heading size="md"> {order.Product.name}</Heading>
                      </Box>
                    )}
                    {order.description && (
                      <Text>Описание: {order.description}</Text>
                    )}
                    <Text color="blue.400" mb="2">
                      Колличество: {order.quantity} шт.
                    </Text>
                    <Text color="blue.400" mb="2">
                      На {order.Product?.price} руб.
                    </Text>
                    <Text color="blue.400" display="block" mb="4" as="b">
                      Общая сумма: {order.total_price.toFixed(2)} руб.
                    </Text>
                    <Box display="block" color="gray.500" as="small" mb="2">
                      Дата заказа:{' '}
                      {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </Box>
                  </>
                ) : (
                  <Text color="red.300">Товар недоступен</Text>
                )}
              </Box>
            ))
          )}
        </VStack>
      </Box>
    </AppContainer>
  );
}

export default Profile;
