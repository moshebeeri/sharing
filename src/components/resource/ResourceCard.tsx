// ResourceCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  IconButton,
} from '@mui/material';
import { ResourceType } from '../resource/ResourcesList';
import { Link } from 'react-router-dom';
import { Rating } from '../xmui/Rating';
import { PriceTag } from '../xmui/PriceTag';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface ResourceCardProps {
  resource: ResourceType;
  rating: number;
  sharerImageUrl: string;
}


const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  rating,
  sharerImageUrl,
}) => {
  const [liked, setLiked] = React.useState(false);

  function truncateDescription(description: string, maxLength: number = 50): string {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + '...'
    }
    return description
  }

  const handleLikeToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setLiked(!liked);
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Link
        to={`/resource-view/${resource.id}`}
        style={{ textDecoration: 'none' }}
      >
        <Card sx={{ maxWidth: 345, position: 'relative' }}>
          <CardMedia
            component="img"
            height="250"
            image={resource.images[resource.primaryImageIndex]}
            alt={resource.title}
          />
          <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
            <Rating value={rating} readOnly sharerImageUrl={sharerImageUrl} />
          </Box>
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <IconButton
              edge="end"
              color="primary"
              onClick={handleLikeToggle}
            >
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              noWrap
              sx={{ fontWeight: 'bold', marginBottom: 1 }}
            >
              {resource.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
              <PriceTag value={resource.price} displayOnly />
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {truncateDescription(resource.description)}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  )
}

export { ResourceCard };
