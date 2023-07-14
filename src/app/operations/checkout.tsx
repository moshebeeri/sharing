import React, { useEffect, useState } from 'react';
import ResourcesList, { ResourceType } from '../../components/resource/ResourcesList';
import { removeResourceFromCart, loadCartItems, savePurchasedItems, saveCartItems } from './cartStorage';
import { getAuth } from 'firebase/auth';
import { Button, Box, Typography, Container } from "@mui/material";

const Checkout = () => {
  const [cartItems, setCartItems] = useState<ResourceType[]>([]);
  const [subtotal, setSubtotal] = useState(0);

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
      const items = await loadCartItems(currentUser.uid);
      const subtotal = items.reduce((total, item) => total + item.price.price, 0);
      setSubtotal(subtotal);
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
    const loadItems = async () => {
      const auth = getAuth()
      const currentUser = auth.currentUser
      if (currentUser) {
        const items = await loadCartItems(currentUser.uid);
        setCartItems(items);
        const subtotal = items.reduce((total, item) => total + item.price.price, 0);
        setSubtotal(subtotal);
      }
    };

    loadItems();
  }, []);

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" bgcolor="lightblue" p={2} borderRadius={2} mb={3}>
        <Typography variant="h5">Subtotal: ${subtotal.toFixed(2)}</Typography>
        <Button variant="contained" color="primary" onClick={handlePay}>Pay</Button>
      </Box>
      <ResourcesList
        resources={cartItems}
        title="Cart"
        onDelete={handleRemove}
      />
    </Container>
  );
};

export default Checkout;
