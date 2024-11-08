import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  fetchCartItems,
  updateCartItem,
  removeFromCart,
  clearCart,
  placeOrder,
} from '@/actions/clientActions';
import Cookies from 'js-cookie';
import { IBusketProduct } from '@/types';
import { useToast } from '@chakra-ui/react';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<IBusketProduct[]>([]);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const userId = Cookies.get('user')
    ? JSON.parse(Cookies.get('user')!).id
    : null;

  const loadCartItems = async () => {
    if (userId) {
      const action = await dispatch(fetchCartItems(userId));
      if (fetchCartItems.fulfilled.match(action)) {
        setCartItems(action.payload as any);
      } else {
        showError('Ошибка загрузки товаров', action.payload as string);
      }
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    const action = await dispatch(
      updateCartItem({ id: productId.toString(), quantity })
    );
    if (updateCartItem.fulfilled.match(action)) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    } else {
      showError('Ошибка обновления количества', action.payload as string);
    }
  };

  const removeProduct = async (productId: number) => {
    const action = await dispatch(removeFromCart({ id: productId.toString() }));
    if (removeFromCart.fulfilled.match(action)) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    } else {
      showError('Ошибка удаления товара', action.payload as string);
    }
  };

  const clearCartItems = () => {
    setCartItems([]);
    dispatch(clearCart());
  };

  const placeCartOrder = () => {
    console.log('placeCartOrder ', userId);

    if (userId) {
      cartItems.forEach((item) => {
        const { quantity, product } = item;

        console.log('item ', item);
        console.log('cartItems ', cartItems);

        if (item.quantity > product.stock) {
          alert(`Недостаточно товара "${product.name}" на складе.`);
        } else {
          console.log('item ', item);
          console.log('----------------------------------');

          const order = {
            quantity,
            total_price: product.price * quantity,
            userId: Number(userId),
            productId: product.id,
          };

          console.log('oder ', order);

          dispatch(placeOrder(order));
        }
      });
    } else {
      showError('Авторизуйтесь, чтобы сделать заказ!');
    }
  };

  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  return {
    cartItems,
    loadCartItems,
    updateQuantity,
    removeProduct,
    clearCartItems,
    placeCartOrder,
  };
};
