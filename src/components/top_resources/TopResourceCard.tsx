import React, { CSSProperties } from 'react'
import { Card, CardContent, IconButton, Typography } from '@mui/material'
import { PriceTag, PricingModel } from '../xmui/PriceTag'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { styled } from '@mui/system'
import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos'
import { Link } from 'react-router-dom'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'

const LikeButtonContainer = styled('div')({
  position: 'absolute', // Change it back to 'absolute'
  top: 15, // Adjust as needed
  right: 15, // This will place it on the right side
  zIndex: 2
})

interface ResourceCardProps {
  resource: {
    id: string
    title: string
    description: string
    price: PricingModel
    images: string[]
    primaryImageIndex: number
  }
}
const StyledCard = styled(Card)({
  width: '350px',
  margin: '20px'
})

const CarouselImage = styled('img')({
  maxHeight: '300px',
  width: 'auto',
  objectFit: 'contain'
})

const CarouselContainer = styled('div')({
  position: 'relative',
  height: '300px',
  width: 'auto',
  objectFit: 'contain'
})

const arrowStyles: CSSProperties = {
  position: 'absolute',
  zIndex: 2,
  top: 'calc(50% - 15px)',
  width: 30,
  height: 30,
  cursor: 'pointer'
}

const TopResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const { title, images, primaryImageIndex } = resource
  const primaryImageUrl = images?.[primaryImageIndex]
  const [liked, setLiked] = React.useState(false)


  function reorderImages(images: string[], primaryIndex: number) {
    if (primaryIndex === 0) {
      return images;
    }
    return [images[primaryIndex], ...images.slice(0, primaryIndex), ...images.slice(primaryIndex + 1)];
  }
  const orderedImages = reorderImages(images, primaryImageIndex);


  return (
    <Link
      to={`/resource-view/${resource.id}`}
      style={{ textDecoration: 'none' }}
    >

    <StyledCard>
      {primaryImageUrl && (
        <CarouselContainer>
          <LikeButtonContainer>
            <IconButton
              color='primary'
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                setLiked(!liked)
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '50%'
              }}
            >
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </LikeButtonContainer>
          <Carousel
            showThumbs={false}
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation()
                    event.preventDefault()
                    onClickHandler()
                  }}
                  title={label}
                  style={{
                    ...arrowStyles,
                    left: 15,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '50%'
                  }}
                >
                  <ArrowBackIos />
                </IconButton>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation()
                    event.preventDefault()
                    onClickHandler()
                  }}
                  title={label}
                  style={{
                    ...arrowStyles,
                    right: 15,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '50%'
                  }}
                >
                  <ArrowForwardIos />
                </IconButton>
              )
            }
          >
            {orderedImages.map((imageUrl, index) => (
              <div key={index}>
                <CarouselImage src={imageUrl} alt={`Slide ${index}`} />
              </div>
            ))}
          </Carousel>
        </CarouselContainer>
      )}
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {title}
        </Typography>
        <PriceTag value={resource.price} displayOnly />
      </CardContent>
    </StyledCard>
    </Link>
  )
}

export default TopResourceCard
