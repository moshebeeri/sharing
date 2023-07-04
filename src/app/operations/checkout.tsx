import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../../features/cart/cartSlice';
import { ResourceType } from '../../components/resource/ResourcesList';
import { RootState } from '../store';

const Checkout = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const handleRemove = (rtype: ResourceType) => {
    dispatch(removeFromCart(rtype));
  };

  return (
    <div>
      {Object.values(cartItems).map((rtype : ResourceType) => (
        <div key={rtype.id}>
          <h2>{rtype.title}</h2>
          <p>Price: {rtype.price.price}</p>
          <button onClick={() => handleRemove(rtype)}>Remove from cart</button>
        </div>
      ))}
    </div>
  );
};

export default Checkout;
