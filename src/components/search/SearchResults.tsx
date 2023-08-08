import React from 'react'
import { Grid } from '@mui/material'
import { ResourceType } from '../resource/ResourcesList'
import { ResourceCard } from '../resource/ResourceCard'


type SearchResultsProps = {
  resources: ResourceType[];
};

const SearchResults: React.FC<SearchResultsProps> = ({resources}) => {


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
