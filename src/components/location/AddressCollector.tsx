import React, { useState, useEffect, useCallback, useRef, FC } from 'react'
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow
} from '@react-google-maps/api'
import Geocode from 'react-geocode'
import { Autocomplete } from '@react-google-maps/api'

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''

Geocode.setApiKey(googleMapsApiKey)

const containerStyle = {
  width: '100%',
  height: '400px'
}

const center = {
  lat: -3.745,
  lng: -38.523
}

const googleMapsLibraries: (
  | 'places'
  | 'drawing'
  | 'geometry'
  | 'localContext'
  | 'visualization'
)[] = ['places']

interface Position {
  lat: number
  lng: number
}

interface AddressCollectorProps {
  onLocationChange: (address: string, position: Position) => void
  initialPosition?: Position
}

const AddressCollector: FC<AddressCollectorProps> = ({
  onLocationChange,
  initialPosition
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [position, setPosition] = useState<Position>()
  const [infoOpen, setInfoOpen] = useState(
    //initialPosition && initialPosition.lat !== 0 && initialPosition.lng !== 0
    true
  )

  const updateLocation = async (newPosition: Position) => {
    const response = await Geocode.fromLatLng(
      newPosition.lat.toString(),
      newPosition.lng.toString()
    )
    if (response.status === 'OK') {
      const address = response.results[0].formatted_address
      onLocationChange(address, newPosition)
    } else {
      onLocationChange('', newPosition)
    }
  }
  const setInitialPosition = (newPosition: Position) => {
    console.log('setInitialPosition', newPosition)
    setPosition(newPosition)
    setInfoOpen(true)
  }

  useEffect(() => {
    if (
      initialPosition &&
      initialPosition.lat !== 0 &&
      initialPosition.lng !== 0
    ) {
      setInitialPosition({ lat: initialPosition.lat, lng: initialPosition.lng })
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setInitialPosition({ lat: coords.latitude, lng: coords.longitude })
      })
    }
  }, [initialPosition])

  // useEffect(() => {
  //   if (
  //     initialPosition &&
  //     initialPosition.lat !== 0 &&
  //     initialPosition.lng !== 0
  //   ) {
  //     setPosition(initialPosition)
  //     // updateLocation(initialPosition);
  //     setInfoOpen(true)
  //   }
  // }, [initialPosition, updateLocation])

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const onMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPosition = { lat: event.latLng.lat(), lng: event.latLng.lng() }
      setPosition(newPosition)
      setInfoOpen(true)
      await updateLocation(newPosition)
    }
  }

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      if (place.geometry) {
        const newPosition = {
          lat: place.geometry.location?.lat() || 0,
          lng: place.geometry.location?.lng() || 0
        }
        setPosition(newPosition)
        updateLocation(newPosition)
      }
    }
  }

  const onAutocompleteLoad = (
    autocompleteRefInstance: google.maps.places.Autocomplete
  ) => {
    autocompleteRef.current = autocompleteRefInstance
  }

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  return (
    <div>
      <h2>Address Collector</h2>
      <LoadScript
        googleMapsApiKey={googleMapsApiKey}
        libraries={googleMapsLibraries}
      >
        <div style={{ position: 'relative', zIndex: 1000 }}>
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type='text'
              placeholder='Search location'
              style={{ pointerEvents: 'auto' }}
            />
          </Autocomplete>
          <div style={{ pointerEvents: 'auto' }}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={position || center}
              zoom={10}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={onMapClick}
            >
              {position && (
                <>
                  <Marker
                    position={position}
                    icon='http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                  />
                  {infoOpen && (
                    <InfoWindow
                      position={position}
                      onCloseClick={() => setInfoOpen(false)}
                    >
                      <div>
                        <p>Selected location:</p>
                        <p>Lat: {position.lat}</p>
                        <p>Lng: {position.lng}</p>
                      </div>
                    </InfoWindow>
                  )}
                </>
              )}
            </GoogleMap>
          </div>
        </div>
      </LoadScript>
    </div>
  )
}

export { AddressCollector, type Position }
