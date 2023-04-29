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
  // required?: boolean;
}

const AddressCollector: FC<AddressCollectorProps> = ({ onLocationChange }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [position, setPosition] = useState<Position | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude })
      })
    }
  }, [])

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

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
                  <Marker position={position} />
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
