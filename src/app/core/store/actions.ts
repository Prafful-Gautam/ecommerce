import {Action} from '@ngrx/store';
import {CartItem} from '../cart/cart-item';

export enum ActionTypes {
  Add = '[Product] Add to cart',
  Remove = '[Product] Remove from cart',
  LoadItems = '[Products] Load items from server',
  LoadSuccess = '[Products] Load success'
}

export class AddToCart implements Action {
  readonly type = ActionTypes.Add;

  constructor(public payload: CartItem) {}
}

export class GetItems implements Action {
  readonly type = ActionTypes.LoadItems;
}

export class RemoveFromCart implements Action {
  readonly type = ActionTypes.Remove;

  constructor(public payload: CartItem) {}
}

export class LoadItems implements Action {
  readonly type = ActionTypes.LoadSuccess;

  constructor(public payload: CartItem[]) {}
}

export type ActionsUnion = AddToCart | RemoveFromCart | LoadItems | GetItems;
