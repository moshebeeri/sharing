import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import availabilityPatternReducer from '../features/availabilityPattern/availabilityPatternSlice';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    availabilityPattern: availabilityPatternReducer,
    auth: authReducer,
    cart: cartReducer,
    // concider using if redux-persist get too many errors
    // middleware: getDefaultMiddleware({
    //   serializableCheck: false,
    // }),

  },
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
