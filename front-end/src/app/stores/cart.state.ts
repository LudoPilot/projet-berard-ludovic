import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Product } from '../models/product.model';
import { AddToCart, ClearCart, RemoveFromCart, UpdateQuantity } from './cart.action';
import { Injectable } from '@angular/core';

export interface CartStateModel {
	cartItems: Product[];
}

@State<CartStateModel>({
	name: 'cart',
	defaults: {
		cartItems: [],
	},
})

@Injectable()
export class CartState {
	@Selector()
	static cartItems(state: CartStateModel) {
		return state.cartItems;
	}

	@Action(AddToCart)
	addToCart({ getState, patchState }: StateContext<CartStateModel>, { payload }: AddToCart) {
		const state = getState();
		let found = false;
		const updatedCartItems = state.cartItems.map(item => {
			if (item.id === payload.id) {
				found = true;
				return { ...item, quantity: (item.quantity || 0) + 1 };
			}
			return item;
		});
	
		if (!found) {
			patchState({ cartItems: [...state.cartItems, { ...payload, quantity: 1 }] });
		} else {
			patchState({ cartItems: updatedCartItems });
		}
	}
	
	@Action(RemoveFromCart)
	removeFromCart(
		{ getState, patchState }: StateContext<CartStateModel>,
		{ productId }: RemoveFromCart
	) {
		const state = getState();
		const updatedCartItems = state.cartItems.filter(
			(item) => item.id !== productId
		);
		patchState({
			cartItems: updatedCartItems,
		});
	}

	@Action(ClearCart)
	clearCart({ setState }: StateContext<CartStateModel>) {
		setState({ cartItems: [] });
	}

	@Action(UpdateQuantity)
	updateQuantity(ctx: StateContext<CartStateModel>, action: UpdateQuantity) {
	  const state = ctx.getState();
	  const updatedCartItems = state.cartItems.map(item => {
		if (item.id === action.payload.productId) {
		  const newQuantity = Math.max(1, item.quantity + action.payload.change);
		  return { ...item, quantity: newQuantity };
		}
		return item;
	  });
	  ctx.setState({
		...state,
		cartItems: updatedCartItems,
	  });
	}	
}
