import React from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Tooltip
} from '@mui/material'
import { ResourceType } from './ResourcesList'
import EditIcon from '@mui/icons-material/Edit'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import { PriceTag } from '../xmui/PriceTag'

interface ResourceCardProps {
  resource: ResourceType
  onEdit: () => void
  onEditSubscribers: () => void
}

const ResourceFormCard: React.FC<ResourceCardProps> = ({
  resource,
  onEdit,
  onEditSubscribers: onEditSubscribers
}) => {
  const { title, description, price, availability, images, primaryImageIndex } =
    resource
  function truncateDescription (
    description: string,
    maxLength: number = 100
  ): string {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + '...'
    }
    return description
  }
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component='img'
        height='250'
        image={images[primaryImageIndex]}
        alt={title}
      />
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant='h5' component='div' sx={{ m: 2 }}>
            {title}
          </Typography>
        </Box>
        <Box>
        <Tooltip title='Edit Resource'>
            <IconButton color='primary' onClick={onEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Edit Subscribers'>
            <IconButton color='primary' onClick={onEditSubscribers}>
              <PeopleAltIcon />
            </IconButton>
          </Tooltip>

        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ m: 2 }}>
          {truncateDescription(description)}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ m: 2 }}>
          <PriceTag value={resource.price} displayOnly />
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ m: 2 }}>
          Availability: {availability}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ResourceFormCard
