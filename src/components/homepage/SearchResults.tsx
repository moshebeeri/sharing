import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CardHeader,
  Avatar
} from '@mui/material'
import { ResourceType } from '../resource/ResourcesList'
import React, { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { firebaseApp } from '../../config/firebase'
import { getFirestore } from '@firebase/firestore'
import { Link } from 'react-router-dom'
import { Rating } from '../xmui/Rating'
import { PriceTag } from '../xmui/PriceTag'

const db = getFirestore(firebaseApp)
function truncateDescription (
  description: string,
  maxLength: number = 250
): string {
  if (description.length > maxLength) {
    return description.slice(0, maxLength) + '...'
  }
  return description
}

const SearchResults: React.FC = () => {
  const [resources, setResources] = useState<ResourceType[]>([])

  useEffect(() => {
    const resourcesQuery = query(collection(db, 'resources'), orderBy('title'))
    const unsubscribe = onSnapshot(resourcesQuery, snapshot => {
      const resourcesData: ResourceType[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ResourceType[]
      setResources(resourcesData)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <Grid container spacing={2}>
      {resources.map(resource => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={resource.id}>
          <Link
            to={`/resource-view/${resource.id}`}
            style={{ textDecoration: 'none' }}
          >
            <Card>
              <CardHeader title={resource.title} />
              <CardMedia
                component='img'
                height='140'
                image={resource.images[resource.primaryImageIndex]}
                alt={resource.title}
              />
              <CardContent>
                <Rating
                  value={Math.round(Math.random() * (5 - 2) + 2)}
                  readOnly
                  sharerImageUrl='https://firebasestorage.googleapis.com/v0/b/share-hobby.appspot.com/o/me_ca.jpg?alt=media&token=22ef457c-6d3e-44c9-84c6-a666c32a2ef1'
                />
                <Typography variant='subtitle1' sx={{ marginTop: '20px' }}>
                  <PriceTag
                    value={resource.price}
                    displayOnly
                  />
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ marginTop: '20px' }}
                >
                  {truncateDescription(resource.description)}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  )
}

export default SearchResults
