import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material'
import TopResourceCard from './TopResourceCard'
import { getFirestore } from '@firebase/firestore'
import { firebaseApp } from '../../config/firebase'

const db = getFirestore(firebaseApp)

const TopResources: React.FC = () => {
  const [topResources, setTopResources] = useState<any[]>([])

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'))
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'))

  const numberOfCards = isSmallScreen
    ? 2
    : isMediumScreen
    ? 4
    : isLargeScreen
    ? 6
    : 4 // default value

  useEffect(() => {
    const fetchTopResources = async () => {
      const topResourcesQuery = query(
        collection(db, 'resources'),
        where('promoted', '==', true)
      )
      const querySnapshot = await getDocs(topResourcesQuery)
      const resources: any[] = []
      querySnapshot.forEach(doc => {
        resources.push({ id: doc.id, ...doc.data() })
      })
      setTopResources(resources.slice(0, numberOfCards))
    }

    fetchTopResources()
  }, [numberOfCards])

  return (
    <div>
      <Typography variant="h4" align="center">Top Resources</Typography>
      <div>
        <Grid container spacing={2}>
          {topResources.map(resource => (
            <TopResourceCard key={resource.id} resource={resource} />
          ))}
        </Grid>
      </div>
    </div>
  )
}

export default TopResources
