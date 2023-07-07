import React, { useEffect, useState } from 'react';
import ResourcesList, { ResourceType } from '../../components/resource/ResourcesList';
import { Button } from "@mui/material";
import { removeResourceFromCart, loadCartItems, savePurchasedItems, saveCartItems } from './cartStorage';
import { getAuth } from 'firebase/auth';

const Checkout = () => {
  const [cartItems, setCartItems] = useState<ResourceType[]>([]);

  const handleRemove = async (resource: ResourceType) => {
    const auth = getAuth()
    const currentUser = auth.currentUser
    if(currentUser)
      await removeResourceFromCart(currentUser.uid, resource.id);
  };

  const handlePay = async () => {
    // Implement your payment logic here

    const auth = getAuth()
    const currentUser = auth.currentUser
    if(currentUser) {
      await savePurchasedItems(currentUser.uid, cartItems);
      await saveCartItems(currentUser.uid, []);
      loadCart();
    }
  };

  const loadCart = async () => {
    const auth = getAuth()
    const currentUser = auth.currentUser
    if(currentUser) {
      const items = await loadCartItems(currentUser.uid);
      setCartItems(items);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);


  return (
    <div>
      <ResourcesList
        resources={cartItems}
        title="Cart"
        onDelete={handleRemove}
      />
      <Button onClick={handlePay}>Pay</Button>
    </div>
  );
};

export default Checkout;
