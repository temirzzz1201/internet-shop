// import { useEffect, useState, useMemo } from 'react';
// import { useAppDispatch } from '@/hooks/useAppDispatch';
// import {
//   fetchCartItems,
//   updateCartItem,
//   removeFromCart,
//   clearCart,
//   placeOrder,
// } from '@/actions/clientActions';
// import Cookies from 'js-cookie';
// import { IBusketProduct } from '@/types';
// import { useToast } from '@chakra-ui/react';

// export const useCart = () => {
//   const [cartItems, setCartItems] = useState<IBusketProduct[]>([]);
//   const dispatch = useAppDispatch();
//   const toast = useToast();
//   const userId = Cookies.get('user')
//     ? JSON.parse(Cookies.get('user')!).id
//     : null;

//   const loadCartItems = async () => {
//     if (userId) {
//       const action = await dispatch(fetchCartItems(userId));
//       if (fetchCartItems.fulfilled.match(action)) {
//         setCartItems(action.payload as any);
//       } else {
//         showError('Ошибка загрузки товаров', action.payload as string);
//       }
//     }
//   };

//   const updateQuantity = async (productId: number, quantity: number) => {
//     const action = await dispatch(
//       updateCartItem({ id: productId.toString(), quantity })
//     );
//     if (updateCartItem.fulfilled.match(action)) {
//       setCartItems((prev) =>
//         prev.map((item) =>
//           item.id === productId ? { ...item, quantity } : item
//         )
//       );
//     } else {
//       showError('Ошибка обновления количества', action.payload as string);
//     }
//   };

//   const removeProduct = async (productId: number) => {
//     const action = await dispatch(removeFromCart({ id: productId.toString() }));
//     if (removeFromCart.fulfilled.match(action)) {
//       setCartItems((prev) => prev.filter((item) => item.id !== productId));
//     } else {
//       showError('Ошибка удаления товара', action.payload as string);
//     }
//   };

//   const clearCartItems = () => {
//     setCartItems([]);
//     dispatch(clearCart());
//   };

//   const placeCartOrder = () => {
//     if (userId) {
//       cartItems.forEach((item) => {
//         const { quantity, product } = item;

//         if (item.quantity > product.stock) {
//           alert(`Недостаточно товара "${product.name}" на складе.`);
//         } else {
//           const order = {
//             quantity,
//             total_price: product.price * quantity,
//             userId: Number(userId),
//             productId: product.id,
//           };

//           dispatch(placeOrder(order));
//         }
//       });
//     } else {
//       showError('Авторизуйтесь, чтобы сделать заказ!');
//     }
//   };

//   const showError = (title: string, description?: string) => {
//     toast({
//       title,
//       description,
//       status: 'error',
//       duration: 3000,
//       isClosable: true,
//     });
//   };

//   useEffect(() => {
//     loadCartItems();
//   }, []);

//   // Вычисляем общее количество товаров
//   const totalQuantity = useMemo(
//     () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
//     [cartItems]
//   );

//   return {
//     cartItems,
//     loadCartItems,
//     updateQuantity,
//     removeProduct,
//     clearCartItems,
//     placeCartOrder,

//     totalQuantity
//   };
// };

import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import cartManager from '@/module/cartManager';
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
  const [cartItems, setCartItems] = useState<IBusketProduct[]>(
    cartManager.getCartItems()
  );
  const [totalQuantity, setTotalQuantity] = useState(
    cartManager.getTotalQuantity()
  );
  const dispatch = useAppDispatch();
  const toast = useToast();
  const userId = Cookies.get('user')
    ? JSON.parse(Cookies.get('user')!).id
    : null;

  useEffect(() => {
    const handleCartChange = (items: IBusketProduct[]) => {
      setCartItems(items);
      setTotalQuantity(cartManager.getTotalQuantity());
    };

    cartManager.on('change', handleCartChange);
    return () => {
      cartManager.off('change', handleCartChange);
    };
  }, []);

  const loadCartItems = async () => {
    if (userId) {
      const action = await dispatch(fetchCartItems(userId));
      if (fetchCartItems.fulfilled.match(action)) {
        cartManager.setCartItems(action.payload as any);
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
      cartManager.updateCartItem(productId, quantity);
    } else {
      showError('Ошибка обновления количества', action.payload as string);
    }
  };

  const removeProduct = async (productId: number) => {
    const action = await dispatch(removeFromCart({ id: productId.toString() }));
    if (removeFromCart.fulfilled.match(action)) {
      cartManager.removeCartItem(productId);
    } else {
      showError('Ошибка удаления товара', action.payload as string);
    }
  };

  const clearCartItems = () => {
    cartManager.clearCart();
    dispatch(clearCart());
  };

  const placeCartOrder = () => {
    if (userId) {
      cartItems.forEach((item) => {
        const { quantity, product } = item;

        if (quantity > product.stock) {
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
      showError('Авторизуйтесь, чтобы сделать заказ!');
    }
  };

  const showError = (title: string, description?: string) => {
    toast({
      position: 'top',
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
    totalQuantity, // Реактивное количество товаров
    loadCartItems,
    updateQuantity,
    removeProduct,
    clearCartItems,
    placeCartOrder,
  };
};
