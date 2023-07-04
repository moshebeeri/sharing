// src/features/cart/cartSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: { [resourceId: string]: any }
}

const initialState: CartState = {
  items: {}
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => {
      state.items[action.payload.id] = action.payload
    },
    removeFromCart: (state, action: PayloadAction<any>) => {
      delete state.items[action.payload.id]
    },
  },
})

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
