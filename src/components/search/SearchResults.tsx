import React, { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import { ResourceType } from '../resource/ResourcesList'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { firebaseApp } from '../../config/firebase'
import { getFirestore } from '@firebase/firestore'
import { ResourceCard } from '../resource/ResourceCard'

const db = getFirestore(firebaseApp)

const SearchResults: React.FC = () => {
  const [resources, setResources] = useState<ResourceType[]>([])

  useEffect(() => {
    const resourcesQuery = query(collection(db, 'resources'), orderBy('title'))
    const unsubscribe = onSnapshot(resourcesQuery, (snapshot) => {
      const resourcesData: ResourceType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ResourceType[]
      setResources(resourcesData)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <Grid container spacing={2}>
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          rating={Math.round(Math.random() * (5 - 2) + 2)}
          sharerImageUrl="https://firebasestorage.googleapis.com/v0/b/share-hobby.appspot.com/o/me_ca.jpg?alt=media&token=22ef457c-6d3e-44c9-84c6-a666c32a2ef1"
        />
      ))}
    </Grid>
  )
}

export default SearchResults
