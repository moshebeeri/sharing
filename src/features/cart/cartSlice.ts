// src/features/cart/cartSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { saveCartItems, loadCartItems } from '../../app/operations/cartStorage';
import { ResourceType } from '../../components/resource/ResourcesList';

// Add to cart action
export const addCartItem = createAsyncThunk<void, { userId: string; item: ResourceType }, { rejectValue: unknown }>(
  'cart/addToCart',
  async ({ userId, item }, thunkAPI) => {
    // Convert Firestore timestamp to JavaScript date
    if (item.createdAt) {
      item.createdAt = new Date();
    }
    thunkAPI.dispatch(actions.addToCart(item));

    // Get the updated cart items
    const cartItems = (thunkAPI.getState() as { cart: CartState }).cart.items;

    // Save the updated cart items to Firestore
    await saveCartItems(userId, Object.values(cartItems));
  }
);

// Load cart items action
export const loadCartItemsAction = createAsyncThunk<{ [resourceId: string]: ResourceType }, string, { rejectValue: unknown }>(
  'cart/loadCart',
  async (userId, thunkAPI) => {
    // Load the cart items from Firestore
    const cartItemsArray = await loadCartItems(userId);

    // Convert the array of cart items to an object
    const cartItemsObject: CartState["items"] = {};
    for (const item of cartItemsArray) {
      cartItemsObject[item.id] = item;
    }

    // Dispatch the loadCart action is not needed here
    // thunkAPI.dispatch(actions.loadCart(cartItemsObject));

    // Return the cart items object
    return cartItemsObject;
  }
);

interface CartState {
  items: { [resourceId: string]: ResourceType }
}

const initialState: CartState = {
  items: {}
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ResourceType>) => {
      if (!action.payload.id) {
        return;
      }
      action.payload.createdAt = new Date();
      state.items[action.payload.id] = action.payload
    },
    removeFromCart: (state, action: PayloadAction<ResourceType>) => {
      delete state.items[action.payload.id]
    },
    loadCart: (state, action: PayloadAction<{ [resourceId: string]: ResourceType }>) => {
      state.items = action.payload;
    }
  },
})

export const actions = cartSlice.actions;

export default cartSlice.reducer;
