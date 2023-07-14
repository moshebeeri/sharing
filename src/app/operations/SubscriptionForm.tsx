import {
  Form,
  InputGroup,
  FormLabel,
  FormGroup,
  FormText
} from 'react-bootstrap'

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Button, Box, Typography } from '@mui/material'
import { User, getAuth } from 'firebase/auth'
import { useParams } from 'react-router-dom'
import { doc, getFirestore, getDoc } from 'firebase/firestore'

import { SubscriptionManager } from './SubscriptionManager'
import { ResourceCard } from '../../components/resource/ResourceCard'
import { ResourceType } from '../../components/resource/ResourcesList'
import { Invite } from '../../components/types'
import { Link, useNavigate } from "react-router-dom";
import { actions as cartActions } from '../../features/cart/cartSlice';

import { useDispatch } from 'react-redux';
import { addResourceToCart, loadCartItems, saveCartItems } from './cartStorage'

const SubscriptionForm = () => {
  const { resourceId } = useParams<{ resourceId: string }>()
  const [resource, setResource] = useState<ResourceType | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [documents, setDocuments] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const MAX_DOCS = 5
  const MAX_SIZE = 200 * 1024 * 1024
  const subscriptionManager = new SubscriptionManager()
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResource = async () => {
      const db = getFirestore()
      const docRef = doc(db, 'resources', resourceId || '')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const r: ResourceType = docSnap.data() as ResourceType;
        r.id = resourceId || '';
        setResource(r)
      } else {
        console.log('No such document!')
      }
    }

    fetchResource()

    const auth = getAuth()
    const currentUser = auth.currentUser
    if (currentUser) {
      setUser(() => currentUser)
    }
  }, [resourceId])

  useEffect(() => {
    const auth = getAuth()
    const currentUser = auth.currentUser
    if (currentUser) {
      setUser(() => currentUser)
    }
  }, [])

  // const [cartItems, setCartItems] = useState<ResourceType[]>([]);
  // useEffect(() => {
  //   const fetchCartItems = async () => {
  //     if (user) {
  //       const items = await loadCartItems(user.uid);
  //       setCartItems(items);
  //     }
  //   };

  //   fetchCartItems();
  // }, [user]);

  const handleDocumentUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      let newDocuments: File[] = [...documents, ...Array.from(files)] // <-- Added type here
      const totalSize = newDocuments.reduce((total, doc) => total + doc.size, 0)

      if (newDocuments.length > MAX_DOCS || totalSize > MAX_SIZE) {
        alert("You can't upload more than 5 files or exceed 200MB in total.")
        return
      }

      setDocuments(() => newDocuments)
    }
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    if (!user || !resource) {
      // handle case where user or resource is not available
      setIsLoading(false)
      return
    }

    // Check if the resource is free
    if (resource.price.price !== 0) {
      console.log("Check if the resource is payed and addResourceToCart:")
      console.log(JSON.stringify(resource))
      await addResourceToCart(user.uid, resource)
      setIsLoading(false)
      navigate(`/checkout`)
      return
    }

    // Check if the user has an invite for closed groups
    if (resource.isGroupClosed) {
      const invites: Invite[] = await subscriptionManager.getInvites(user.uid)
      const isInvited = invites.some(
        (invite: Invite) => invite.resourceId === resourceId
      )
      if (!isInvited) {
        alert('You must be invited to subscribe to this resource')
        setIsLoading(false)
        return
      }
    }

    // Handle document upload
    const uploadedDocuments = await subscriptionManager.uploadDocuments(documents)

    // Subscribe the user to the resource
    console.log('Subscribing user to resource ' + resource)
    await subscriptionManager.subscribe({ userId: user.uid }, resourceId || '' )

    setIsLoading(false)
  }

  const requiresDocuments = true //resource?.requiresDocuments || true;
  return (
    <Box sx={{ mt: 2 }}>
      {resource && (
        <>
          <ResourceCard resource={resource} rating={0} sharerImageUrl={''} />
          <Form onSubmit={handleSubmit}>
            {requiresDocuments && (
              <FormGroup>
                <Typography>Upload Required Documents:</Typography>
                <input
                  type='file'
                  name='file'
                  id='fileUpload'
                  multiple
                  onChange={handleDocumentUpload}
                />
                <FormText color='muted'>
                  Please upload the necessary documents.
                </FormText>
              </FormGroup>
            )}
            <Button
              type='submit'
              disabled={isLoading}
              variant='contained'
              color='primary'
            >
              {isLoading ? 'Processing...' : 'Subscribe'}
            </Button>
          </Form>
        </>
      )}
    </Box>
  )
}

export default SubscriptionForm
