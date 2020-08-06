import { Store } from './store';
import { CartState, initialState } from './cart-state';
import { Injectable } from '@angular/core';
import { CartItem } from './cart-item';

@Injectable({providedIn: 'root'})
export class CartStore extends Store<CartState>{
  constructor(){
    super(initialState);
  }

  addCartItem(cartItemToAdd: import('./cart-item').CartItem){
    console.log('Add cart item');
    const newState = {
      ...this.state,
      cartItems: [].concat(this.state.cartItems, cartItemToAdd)
    };

    this.setState(newState);
  }

  clearCart(){
    console.log('[Cart] clear cart item');
    const newState = initialState;
    this.setState(newState);
  }

  restoreCart(restoreCart: CartState){
    console.log('[Cart] restore cart');
    this.setState(restoreCart);
  }

  removeCartItem(cartItemToRemove: CartItem){
    console.log('[Cart] remove cart item');

    const newState = {
      ...this.state,
      cartItems: this.state.cartItems.filter(cartItem => cartItem.productId !== cartItemToRemove.productId)
    };
    this.setState(newState);
  }

  updateCartItem(updateItem: CartItem){
    console.log('[Cart] update cart item');
    const newState = {
      ...this.state,
      cartItems: this.state.cartItems.map(cartItem => cartItem.productId === updateItem.productId ? updateItem : cartItem)
    };
    this.setState(newState);

  }
}
