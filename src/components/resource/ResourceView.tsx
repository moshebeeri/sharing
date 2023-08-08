import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  IconButton
} from '@mui/material'
import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos'
import { useParams, Params } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { ResourceType } from '../resource/ResourcesList' // Update the path as needed
import { getFirestore } from '@firebase/firestore'
import { firebaseApp } from '../../config/firebase'
import { PriceTag } from '../xmui/PriceTag'
import { Rating } from '../xmui/Rating'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import Geocode from 'react-geocode'
import { CSSProperties, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const db = getFirestore(firebaseApp)
const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''

Geocode.setApiKey(googleMapsApiKey)

const arrowStyles: CSSProperties = {
  position: 'absolute',
  zIndex: 2,
  top: 'calc(50% - 15px)',
  width: 30,
  height: 30,
  cursor: 'pointer'
}

interface ResourceViewParams extends Params {
  resourceId: string
}

const ResourceView: React.FC = () => {
  const { resourceId } = useParams<ResourceViewParams>()
  const [resource, setResource] = useState<ResourceType>()
  const navigate = useNavigate();

  function reorderImages(images: string[], primaryIndex: number) {
    if (primaryIndex === 0) {
      return images;
    }
    return [images[primaryIndex], ...images.slice(0, primaryIndex), ...images.slice(primaryIndex + 1)];
  }
  const orderedImages = reorderImages(resource?.images || [], resource?.primaryImageIndex || 0);

  useEffect(() => {
    const fetchResource = async () => {
      const resourceDoc = await getDoc(
        doc(db, 'resources', resourceId as string)
      )
      if (resourceDoc.exists()) {
        setResource({
          id: resourceDoc.id,
          ...resourceDoc.data()
        } as ResourceType)
      } else {
        console.error('Resource not found')
      }
    }

    fetchResource()
  }, [resourceId])

  if (!resource) {
    return <Typography>Loading...</Typography>
  }

  const mapContainerStyle = {
    width: '80%',
    height: '500px',
  }

  const center = {
    lat: resource.lat,
    lng: resource.lng
  }
  const handleBuy = () => {
    navigate(`/buy/${resource.id}`);
  }

  return (
    <Container>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h4'>{resource.title}</Typography>
        <Button variant='contained' color='primary' onClick={handleBuy}>
          Buy Your Share Now
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Box mt={3}>
          <Rating
            value={Math.round(Math.random() * (5 - 2) + 2)}
            readOnly
            sharerImageUrl='https://firebasestorage.googleapis.com/v0/b/share-hobby.appspot.com/o/me_ca.jpg?alt=media&token=22ef457c-6d3e-44c9-84c6-a666c32a2ef1'
          />
        </Box>
        <Typography variant='subtitle1' sx={{ marginTop: '20px' }}>
          <PriceTag value={resource.price} displayOnly />
        </Typography>

        <Grid item xs={12}>
          <Typography variant='h5'>Images:</Typography>
          <Carousel
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <IconButton
                  onClick={onClickHandler}
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
                  onClick={onClickHandler}
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
        {orderedImages.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`Resource ${index + 1}`}
                style={{
                  width: '100%',
                  maxHeight: '600px',
                  objectFit: 'contain',
                }}
              />
            ))}
          </Carousel>
        </Grid>

        <Grid item xs={12}>
          <Typography variant='h5'>Description:</Typography>
          <Typography variant='body1'>{resource.description}</Typography>
        </Grid>
        {resource.isPickup ? (
          <Grid item xs={12}>
            <Typography variant='h5'>Pickup Location:</Typography>
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={15}
                center={center}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography variant='h5'>
              Service Radius: {resource.radius} miles|km
            </Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant='h5'>Videos:</Typography>
          {resource.videos.map((video: string, index: number) => (
            <video
              key={index}
              src={video}
              controls
              width='320'
              height='240'
              style={{ marginRight: 8 }}
            />
          ))}
        </Grid>

        <Grid item xs={12} style={{ textAlign: 'center', marginTop: 30 }}>
          <Button variant='contained' color='primary' onClick={handleBuy} style={{ position: 'relative', zIndex: 2 }}>
            Buy Your Share Now
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ResourceView
