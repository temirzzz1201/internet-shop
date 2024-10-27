'use client';
import { useEffect, useState } from 'react';
import { Box, HStack, Button, Input, useToast } from '@chakra-ui/react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import AppContainer from '@/components/app-container';
import { placeOrder, updateProduct } from '@/actions/clientActions';
import Cookies from 'js-cookie';

interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  images: { id: number; imageUrl: string }[];
}

interface IBusketProduct {
  product: IProduct;
  quantity: number;
}

const Busket = () => {
  const [busketProduct, setBusketProduct] = useState<IBusketProduct[]>([]);
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    const products = localStorage.getItem('busket');
    console.log('products from localStorage:', products);

    if (products) {
      try {
        const parsedProducts: IBusketProduct[] = JSON.parse(products);
        
        if (Array.isArray(parsedProducts) && parsedProducts.every(item => item.quantity && item.product)) {
          setBusketProduct(parsedProducts);
        } 
      } catch (error) {
        console.error('Ошибка при парсинге JSON:', error);
      }
    } else {
      console.log('В localStorage под ключом "busket" нет данных.');
    }
  }, []);

  const updateLocalStorage = (products: IBusketProduct[]) => {
    localStorage.setItem('busket', JSON.stringify(products));
  };

  const handleQuantityChange = (index: number, value: number) => {
    setBusketProduct((prev) => {
      const updatedProducts = prev.map((item, i) => (i === index ? { ...item, quantity: value } : item));
      updateLocalStorage(updatedProducts);
      return updatedProducts;
    });
  };

  const handleIncrement = (index: number, stock: number) => {
    setBusketProduct((prev) => {
      const newQuantity = prev[index].quantity + 1;
      if (newQuantity <= stock) {
        const updatedProducts = prev.map((item, i) => (i === index ? { ...item, quantity: newQuantity } : item));
        updateLocalStorage(updatedProducts);
        return updatedProducts;
      }
      return prev;
    });
  };

  const handleDecrement = (index: number) => {
    setBusketProduct((prev) => {
      const newQuantity = prev[index].quantity - 1;
      if (newQuantity >= 0) {
        const updatedProducts = prev.map((item, i) => (i === index ? { ...item, quantity: newQuantity } : item));
        updateLocalStorage(updatedProducts);
        return updatedProducts;
      }
      return prev;
    });
  };

  const handleRemoveProduct = (index: number) => {
    setBusketProduct((prev) => {
      const updatedProducts = prev.filter((_, i) => i !== index);
      updateLocalStorage(updatedProducts);
      return updatedProducts;
    });
  };

  const handleOrder = () => {
    const userCookie = Cookies.get('user');
    if (!userCookie) {
      toast({
        title: 'Авторизуйтесь, чтобы сделать заказ!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    const userId = JSON.parse(userCookie).id;
  
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
        dispatch(updateProduct({
          productId: product.id,
          updates: { stock: product.stock - quantity },
          updateFlag: 'products/update-product',
        }));
      }
    });
  };
  

  const handleClearBusket = () => {
    setBusketProduct([]);
    localStorage.removeItem('busket');
  };

  const totalQuantity = busketProduct.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = busketProduct.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <AppContainer title='Корзина' myClass="justify-start">
      <Box display='flex' justifyContent='space-between' w='100%'>
        <Box>
          {busketProduct.length > 0 ? (
            busketProduct.map((item, index) => {
              const { product, quantity } = item;

              return (
                <div key={product.id}>
                  <p>Товар: {product.name}</p>
                  <p>Количество: {quantity}</p>
                  <p>Цена: {product.price} руб.</p>

                  <Box mb="4">
                    <HStack>
                      <Button size="sm" onClick={() => handleDecrement(index)} isDisabled={quantity <= 0}>
                        -
                      </Button>
                      <Input
                        size="sm"
                        value={quantity}
                        textAlign="center"
                        readOnly
                      />
                      <Button size="sm" onClick={() => handleIncrement(index, product.stock)} isDisabled={quantity >= product.stock}>
                        +
                      </Button>
                      <Button size="sm" colorScheme="red" onClick={() => handleRemoveProduct(index)}>
                        Удалить
                      </Button>
                    </HStack>
                  </Box>
                </div>
              );
            })
          ) : (
            <div>В корзине пусто</div>
          )}
        </Box>
        <Box bg='orange.300' p='5' borderRadius='20px'>
          <Box>Перейти к оформлению</Box>
          <Box>
            <p>Общее количество товаров: {totalQuantity}</p>
            <p>Общая сумма: {totalPrice} руб.</p>
          </Box>
          <Box mb="5">
            <Button
              size="sm"
              colorScheme="green"
              mr={3}
              onClick={handleOrder}
              isDisabled={busketProduct.length === 0}
            >
              Оформить
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              onClick={handleClearBusket}
            >
              Очистить корзину
            </Button>
          </Box>
        </Box>
      </Box>
    </AppContainer>
  );
};

export default Busket;
