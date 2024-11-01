'use client';
import { useEffect, useState } from 'react';
import { Box, HStack, Button, Input, Image, useToast } from '@chakra-ui/react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import AppContainer from '@/components/app-container';
import { placeOrder, fetchCartItems, updateCartItem, removeFromCart, clearCart } from '@/actions/clientActions';
import Cookies from 'js-cookie';
import AppModal from '@/components/app-modal';
import { IBusketProduct } from '@/types';

const Busket = () => {
  const [busketProduct, setBusketProduct] = useState<IBusketProduct[]>([]);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userCookie = Cookies.get('user');
  const userId = userCookie ? JSON.parse(userCookie).id : null;

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const loadCartItems = async () => {
    if (userId) {
      const action = await dispatch(fetchCartItems(userId));
      if (fetchCartItems.fulfilled.match(action)) {
        setBusketProduct(action.payload);
      } else {
        console.error('Ошибка загрузки товаров:', action.payload);
        toast({
          title: 'Ошибка загрузки товаров',
          description: action.payload,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };


  useEffect(() => {
    loadCartItems();
  }, []);

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (userId) {
      const action = await dispatch(updateCartItem({ id: productId.toString(), quantity: newQuantity }));
      console.log('Результат updateCartItem:', action);
      
      if (updateCartItem.fulfilled.match(action)) {
        setBusketProduct((prev) =>
          prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
        );
      } else {
        console.error('Ошибка обновления количества:', action.payload);
        toast({
          title: 'Ошибка обновления количества',
          description: action.payload,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleIncrement = (index: number) => {
    const product = busketProduct[index];
    const stock = product.product?.stock;

    if (stock === undefined) {
      console.error(`Запас для продукта с id ${product.product.id} не определен`);
      return;
    }

    const newQuantity = product.quantity + 1;
    if (newQuantity <= stock) {
      handleUpdateQuantity(product.id, newQuantity);
    } else {
      toast({
        title: 'Превышение запаса товара',
        description: `Невозможно увеличить количество товара "${product.product.name}"`,
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDecrement = (index: number) => {
    const product = busketProduct[index];
    console.log('handleDecrement ', product);
    
    const newQuantity = product.quantity - 1;
    if (newQuantity >= 0) {
      handleUpdateQuantity(product.id, newQuantity);
    }
  };

  const handleRemoveProduct = async (index: number) => {
    const productId = busketProduct[index].product.id;
    console.log('productId ', productId);
    
    const action = await dispatch(removeFromCart({ id: productId.toString() }));
    if (removeFromCart.fulfilled.match(action)) {
      setBusketProduct((prev) => prev.filter((_, i) => i !== index));
    } else {
      console.error('Ошибка удаления товара:', action.payload);
      toast({
        title: 'Ошибка удаления товара',
        description: action.payload as any,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleOrder = () => {
    if (!userId) {
      toast({
        title: 'Авторизуйтесь, чтобы сделать заказ!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    busketProduct.forEach((item) => {
      const { quantity, product } = item;
      const orderData = {
        quantity,
        total_price: product.price * quantity,
        userId: Number(userId),
        productId: product.id,
      };

      if (quantity > product.stock) {
        alert(`Недостаточно товара "${product.name}" на складе.`);
      } else {
        dispatch(placeOrder(orderData));
        handleOpen();
      }
    });
  };

  const handleClearBusket = () => {
    setBusketProduct([]);
    dispatch(clearCart());
  };

  const totalQuantity = busketProduct.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = busketProduct.reduce((total, item) => {
    return item.product ? total + item.product.price * item.quantity : total;
  }, 0);

  return (
    <AppContainer title="Оформление заказа" myClass="justify-start">
      <AppModal isOpen={isModalOpen} onClose={handleClose} title="Заказ оформлен">
        {busketProduct.map((item, index) => (
          <Box key={`${item.product.id}-${index}`} mb="2" mr="7" maxW="750px" p="10px">
            <Box as="h3" mb="3" fontSize="md" fontWeight="semibold">Товар: {item.product?.name}</Box>
            <Box as="p" mb="2">Количество: {item.quantity}</Box>
            <Box as="p" mb="5" fontWeight="semibold">Цена: {item.product?.price} руб.</Box>
          </Box>
        ))}
      </AppModal>
      <Box display="flex" justifyContent="space-between" w="100%">
        <Box>
          {busketProduct.length > 0 ? (
            busketProduct.map((item, index) => (
              <Box key={`${item.product.id}-${index}`} mb="12" mr="7" maxW="750px" border="1px solid blue" borderRadius="20px" p="10px">
                <Box as="h3" mb="3" fontSize="xl" fontWeight="semibold">Товар: {item.product?.name}</Box>
                <Box display="flex" gap="4" mb="3">
                  {item.product.images.map((image, imgIndex) => (
                    <Image key={`${item.product.id}-${imgIndex}`} src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${image.imageUrl}`} alt={item.product.name} boxSize="100px" />
                  ))}
                </Box>
                <Box as="p" mb="2">Количество: {item.quantity}</Box>
                <Box as="p" mb="5" fontWeight="semibold">Цена: {item.product?.price} руб.</Box>
                <HStack mb="4">
                  <Button size="sm" onClick={() => handleDecrement(index)} isDisabled={item.quantity <= 0}>-</Button>
                  <Input size="sm" value={item.quantity} textAlign="center" readOnly />
                  <Button size="sm" onClick={() => handleIncrement(index)} isDisabled={item.quantity >= item.product.stock}>+</Button>
                  <Button minW="120px" ml="5" size="sm" colorScheme="red" onClick={() => handleRemoveProduct(index)}>Удалить</Button>
                </HStack>
              </Box>
            ))
          ) : (
            <Box as="h2">В корзине пусто</Box>
          )}
        </Box>
        <Box bg="orange.100" p="5" borderRadius="20px" maxH='fit-content'>
          <Box as="h3" mb="3" fontSize="2xl" fontWeight="semibold">Перейти к оформлению</Box>
          <Box>
            <Box as="p" mb="5">Количество товаров: {totalQuantity}</Box>
            <Box as="p" mb="5">Итоговая цена: {totalPrice} руб.</Box>
            <Button colorScheme="teal" size="lg" onClick={handleOrder}>Оформить заказ</Button>
            <Button colorScheme="red" size="lg" onClick={handleClearBusket} ml="4">Очистить корзину</Button>
          </Box>
        </Box>
      </Box>
    </AppContainer>
  );
};

export default Busket;
