import { CartStore } from './cart-store';
import { TestBed } from '@angular/core/testing';
import { initialState, CartState } from './cart-state';
import { CartItem } from './cart-item';

describe('CartStore', () => {
  let cartStore: CartStore;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartStore]
    });
    cartStore = TestBed.get(CartStore);
  });

  it('should create an instance', () => {
    expect(cartStore).toBeTruthy();
  });

  it('can add item to cart state', () => {

    // Arrange
    const currentState = initialState;
    expect(currentState.cartItems.length).toBe(0);

    const cartItem: CartItem = {
      productId: 1,
      imgUrl: 'img/apple',
      price: 2,
      name: 'xyz',
      quantity: 3,
      itemTotal: 6
    };

    // Act
    cartStore.addCartItem(cartItem);
    const exptectedState = {cartItems: [cartItem]};

    // Assert
    expect(cartStore.state).toEqual(exptectedState);
  });

  //--------------------------Clear Cart----------------------

  it('can clear cart to initial state', () => {

    // Arrange

    const cartItem: CartItem = {
      productId: 1,
      imgUrl: 'img/apple',
      price: 2,
      name: 'xyz',
      quantity: 3,
      itemTotal: 6
    };

    cartStore.addCartItem(cartItem);

    const currentState = { cartItems: [cartItem] };

    expect(cartStore.state).toEqual(currentState);

    // Act
    cartStore.clearCart();

    // Assert
    expect(cartStore.state).toEqual(initialState);

  });

  // ----------------------------Restore Cart------------------
  it('can restore cart', () => {

    // Arrange
    const currentState = initialState;
    expect(cartStore.state).toEqual(currentState);

    const cartItem: CartItem = {
      productId: 1,
      imgUrl: 'img/apple',
      price: 2,
      name: 'xyz',
      quantity: 3,
      itemTotal: 6
    };

    const exptectedState: CartState = {cartItems: [cartItem]};
    // Acts
    cartStore.restoreCart(exptectedState);

    // Assert
    expect(cartStore.state).toEqual(exptectedState);

  });

    // ----------------------------Remove Cart Item------------------
  it('can restore cart', () => {

      // Arrange

      const cartItem: CartItem = {
        productId: 1,
        imgUrl: 'img/apple',
        price: 2,
        name: 'xyz',
        quantity: 3,
        itemTotal: 6
      };
      const cartItem1: CartItem = {
        productId: 2,
        imgUrl: 'img/orrange',
        price: 3,
        name: 'abc',
        quantity: 5,
        itemTotal: 78
      };

      const currentState: CartState = {cartItems: [cartItem, cartItem1]};
      cartStore.restoreCart(currentState);

      expect(cartStore.state).toEqual(currentState);

      // Acts
      cartStore.removeCartItem(cartItem);

      // Assert
      const exptectedState: CartState = {
        cartItems: [cartItem1]
      };
      expect(cartStore.state).toEqual(exptectedState);

    });

        // ----------------------------Update Cart Item------------------
  it('can update cart', () => {

    // Arrange

    const cartItem: CartItem = {
      productId: 1,
      imgUrl: 'img/apple',
      price: 2,
      name: 'xyz',
      quantity: 3,
      itemTotal: 6
    };
    const cartItem1: CartItem = {
      productId: 2,
      imgUrl: 'img/orrange',
      price: 3,
      name: 'abc',
      quantity: 5,
      itemTotal: 78
    };

    const currentState: CartState = {cartItems: [cartItem, cartItem1]};
    cartStore.restoreCart(currentState);

    expect(cartStore.state).toEqual(currentState);

    // Acts
    const updateItem: CartItem = {
      productId: 2,
      imgUrl: 'img/orrange',
      price: 3,
      name: 'abc',
      quantity: 10,
      itemTotal: 780
    }
    cartStore.updateCartItem(updateItem);

    // Assert
    const exptectedState: CartState = {
      cartItems: [cartItem, updateItem]
    };
    expect(cartStore.state).toEqual(exptectedState);

  });
});


