// src/app/operations/cartStorage.ts
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc
} from 'firebase/firestore';
import { firebaseApp } from '../../config/firebase';
import { ResourceType } from '../../components/resource/ResourcesList';
import { SubscriptionManager } from './SubscriptionManager';

const db = getFirestore(firebaseApp);

// Save the cart items to Firestore
export const saveCartItems = async (userId: string, cartItems: ResourceType[]) => {
  const userCartRef = doc(db, 'carts', userId);
  await setDoc(userCartRef, { items: cartItems });
};

// Load the cart items from Firestore
export const loadCartItems = async (userId: string) => {
  const userCartRef = doc(db, 'carts', userId);
  const cartSnap = await getDoc(userCartRef);
  if (cartSnap.exists()) {
    return cartSnap.data().items as ResourceType[];
  } else {
    return []; // return an empty array if there are no cart items
  }
};

export const addResourceToCart = async (userId: string, resource: ResourceType) => {
  let cartItems = await loadCartItems(userId);

  if (!cartItems.find(item => item.id === resource.id)) { // check if resource already exists in cart
    cartItems = [...cartItems, resource];
    await saveCartItems(userId, cartItems);
  }
};

export const removeResourceFromCart = async (userId: string, resourceId: string) => {
  // Load the current cart items
  let cartItems = await loadCartItems(userId);

  // Remove the item with the matching ID from the array
  cartItems = cartItems.filter(item => item.id !== resourceId);

  // Save the updated cart items back to Firestore
  await saveCartItems(userId, cartItems);
};

export const savePurchasedItems = async (userId: string, items: ResourceType[]) => {
  const userPurchasedCollection = collection(db, 'users', userId, 'purchased');
  const sm = new SubscriptionManager()

  // Save each item as a separate document in the 'purchased' subcollection
  for (const item of items) {
    console.log(`savePurchasedItems resourceId: ${item.id}`)
    await addDoc(userPurchasedCollection, {
      resourceId: item.id,
      pricingModel: item.price,
    });
    await sm.purchase(item.id, item.price)
  }
};
