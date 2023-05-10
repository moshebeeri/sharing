import React from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box
} from '@mui/material'
import { ResourceType } from './ResourcesList'
import EditIcon from '@mui/icons-material/Edit'
import { PriceTag } from '../xmui/PriceTag'

interface ResourceCardProps {
  resource: ResourceType
  onEdit: () => void
}

const ResourceFormCard: React.FC<ResourceCardProps> = ({ resource, onEdit }) => {
  const { title, description, price, availability, images, primaryImageIndex } =
    resource

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component='img'
        height='140'
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
          <Typography variant='h5' component='div'>
            {title}
          </Typography>
          <IconButton color='primary' onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Box>
        <Typography variant='body2' color='text.secondary'>
          {description}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          <PriceTag
            value={resource.price}
            displayOnly
          />
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Availability: {availability}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ResourceFormCard
