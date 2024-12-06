import { EventEmitter } from 'events';
import { IBusketProduct } from '@/types';

class CartManager extends EventEmitter {
  private cartItems: IBusketProduct[] = [];

  getCartItems() {
    return this.cartItems;
  }

  setCartItems(items: IBusketProduct[]) {
    this.cartItems = items;
    this.emit('change', this.cartItems);
  }

  addCartItem(item: IBusketProduct) {
    this.cartItems.push(item);
    this.emit('change', this.cartItems);
  }

  updateCartItem(productId: number, quantity: number) {
    this.cartItems = this.cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    this.emit('change', this.cartItems);
  }

  removeCartItem(productId: number) {
    this.cartItems = this.cartItems.filter((item) => item.id !== productId);
    this.emit('change', this.cartItems);
  }

  clearCart() {
    this.cartItems = [];
    this.emit('change', this.cartItems);
  }

  getTotalQuantity() {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}

const cartManager = new CartManager();

export default cartManager;
