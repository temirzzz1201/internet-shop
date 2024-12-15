'use client';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { useState, Suspense, useMemo, useEffect } from 'react';
import AppContainer from '@/components/app-container';
import CartItem from '@/components/cart-item';
import CartSummary from '@/components/cart-summary';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useInfoMessage } from '@/utils/toastHelper';
import { clearCart, fetchCartItems, placeOrder, removeFromCart, updateCartItem } from '@/actions/clientActions';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ICartItem } from '@/types';

const AppModal = dynamic(() => import('@/components/app-modal'), {
  ssr: false,
});

const Busket = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const showInfoMessage = useInfoMessage();

  const { cartItems, totalQuantity } = useAppSelector(state => state.cart)

  console.log(totalQuantity);
  

  const userId = Cookies.get('user')
    ? JSON.parse(Cookies.get('user')!).id
    : null;

  useEffect(() => {
    dispatch(fetchCartItems(userId));
  }, [])


  const handleIncrement = (item: ICartItem) => {
    if (item.quantity < item.product.stock) {
      dispatch(updateCartItem({ id: item.id, quantity: item.quantity + 1 }));
    }
  };

  const handleDecrement = (item: ICartItem) => {
    if (item.quantity > 0) {
      dispatch(updateCartItem({ id: item.id, quantity: item.quantity - 1 }));
    }
  };

  const handleRemoveFromCart = (itemId: number) => {
    dispatch(removeFromCart({id: itemId}));
  }

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
    [cartItems]
  );



  const placeOrderHandler = async () => {
    if (userId) {
      cartItems.forEach((item) => {
        const { quantity, product } = item;

        if (item.quantity > product.stock) {
          alert(`Недостаточно товара "${product.name}" на складе.`);
        } else {
          const order = {
            quantity,
            total_price: product.price * quantity,
            userId: Number(userId),
            productId: product.id,
          };

          dispatch(placeOrder(order));
        }
      });
    } else {
      showInfoMessage('top','Авторизуйтесь, чтобы сделать заказ!', 'error');
    }
  };

  const handleOrder = () => {
    if (totalQuantity > 0) {
      placeOrderHandler();
      setIsModalOpen(true);
    }
  };

  const handleClearOrder = () => {
    if (totalQuantity !== 0) {
      dispatch(clearCart())
    }
  };

  return (
    <AppContainer title="Оформление заказа" myClass="justify-center">
      <Suspense fallback={<Box as="div">Загрузка...</Box>}>
        <AppModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Заказ оформлен"
          modalSize="xl"
        >
          {cartItems.map((item) => (
            <Box key={item.id} p="10px">
              <Box fontWeight="semibold">Товар: {item.product?.name}</Box>
              <Box>Количество: {item.quantity}</Box>
              <Box>Цена: {item.product?.price} руб.</Box>
            </Box>
          ))}
        </AppModal>
      </Suspense>
      <Stack
        w="100%"
        direction={{ base: 'column', md: 'row' }}
        spacing={{ base: '3', md: '5' }}
        mb="5"
        align="stretch"
      >
        <CartSummary
          totalQuantity={totalQuantity}
          totalPrice={totalPrice}
          onOrder={handleOrder}
          onClear={handleClearOrder}
        />
        <Box w="100%">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Box mb="5" key={item.id}>
                <CartItem
                  item={item}
                  onIncrement={() => handleIncrement(item)}
                  onDecrement={() => handleDecrement(item)}
                  onRemove={() => handleRemoveFromCart(item.id)}
                />
              </Box>
            ))
          ) : (
            <Heading size="lg" textAlign="center">
              Корзина пуста!
            </Heading>
          )}
        </Box>
      </Stack>
    </AppContainer>
  );
};

export default Busket;

