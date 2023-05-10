import React from 'react'
import { Card, CardContent, CardMedia, Typography } from '@mui/material'

interface ResourceCardProps {
  resource: {
    id: string
    title: string
    description: string
    price: number
    images: string[]
    primaryImageIndex: number
  }
}

const TopResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const { title, description, price, images, primaryImageIndex } = resource
  const primaryImageUrl = images?.[primaryImageIndex]

  return (
    <Card>
      {primaryImageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={primaryImageUrl}
          alt={title}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2" color="text.primary">
          Price: {price}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default TopResourceCard
