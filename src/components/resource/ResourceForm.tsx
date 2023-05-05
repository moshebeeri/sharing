import React, {
  ChangeEvent,
  FormEvent,
  useState,
  useEffect,
  useRef
} from 'react'
import { Form, Button, InputGroup, FormLabel } from 'react-bootstrap'
import {
  collection,
  query,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  where
} from 'firebase/firestore'

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirestore } from '@firebase/firestore'
import { getStorage } from 'firebase/storage'
import { firebaseApp } from '../../config/firebase'
import {
  Typography,
  Card,
  CardContent,
  ListItemText,
  List,
  ListItem,
  Grid,
  MenuItem,
  Select,
  TextField,
  FormControl,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import { blue } from '@mui/material/colors'
import { Box } from '@mui/system'
import AddIcon from '@mui/icons-material/Add'
import { getAuth } from 'firebase/auth'
import { Container, IconButton } from '@mui/material'
import { CheckBox, CheckBoxOutlineBlank, Delete } from '@mui/icons-material'
import { AvailabilityPatternForm, PatternType } from './AvailabilityPatternForm'
import { useAppSelector } from '../../app/hooks'
import Alert from '@mui/material/Alert'
import { AddressCollector } from '../location/AddressCollector'
import { styled, Theme } from '@mui/system'
import { AvailabilityPattern } from './AvailabilityPattern'
import {PriceTag, PricingModel } from '../xmui/PriceTag';
import { ResourceType } from './ResourcesList'

const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)
const auth = getAuth(firebaseApp)
const userRole = 'admin'

interface ResourceFormProps {
  resource?: ResourceType;
  onSubmit: () => void
  editMode?: boolean
}

const StyledCard = styled(Card)`
  margin-bottom: 20px;
  border-radius: 5px;
  padding: 15px;
  border: 1px solid #ced4da;
`
const defaultPrice: PricingModel = {
  price: 0,
  period: 'year',
  billingFrequency: 'monthly',
  currency: 'USD'
};

const ResourceForm: React.FC<ResourceFormProps> = ({
  resource,
  onSubmit,
  editMode
}) => {
  const availabilityPatternError = useAppSelector(
    state => state.availabilityPattern.error.message
  )
  const [title, setTitle] = useState(resource?.title ?? '')
  const [description, setDescription] = useState(resource?.description ?? '')

  const [price, setPrice] = useState<PricingModel>(resource?.price ?? defaultPrice);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'CAD' | 'MXN'>('USD')

  const [availabilityPatterns, setAvailabilityPatterns] = useState<
    AvailabilityPattern[]
  >(
    resource?.availability?.map(
      patternString => new AvailabilityPattern(patternString)
    ) ?? []
  )
  const [currentPattern, setCurrentPattern] = useState<string>('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [selectedImages, setSelectedImages] = useState<
    { file: File; url: string }[]
  >([])
  const [imageUrls, setImageUrls] = useState<string[]>(resource?.images ?? [])
  const [primaryImageIndex, setPrimaryImageIndex] = useState(
    resource?.primaryImageIndex ?? 0
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const [availableResources, setAvailableResources] = useState(
    resource?.availableResources ?? 1
  )
  const [isGroupClosed, setIsGroupClosed] = useState(
    resource?.isGroupClosed ?? false
  )
  const [resourceGroupName, setResourceGroupName] = useState(
    resource?.resourceGroupName ?? ''
  )
  const [videoFiles, setVideoFiles] = useState<File[]>([])
  const [resourceGroupNames, setResourceGroupNames] = useState<string[]>([])

  const [resourceCategoryName, setResourceCategoryName] = useState(
    resource?.resourceCategoryName ?? ''
  )
  const [resourceCategoryNames, setCategoryGroupNames] = useState<string[]>([])
  const [addNewResourceGroup, setAddNewResourceGroup] = useState(false)
  const [addNewResourceCategory, setAddNewResourceCategory] = useState(false)

  const [formValid, setFormValid] = useState(false)
  const [addressData, setAddressData] = useState({
    address: resource?.address ?? '',
    lat: resource?.lat ?? 0,
    lng: resource?.lng ?? 0
  })
  const [radius, setRadius] = useState<number | null>(resource?.radius ?? null)
  const [radiusUnit, setRadiusUnit] = useState<'miles' | 'km'>('miles')
  const [isPickup, setIsPickup] = useState<boolean>(resource?.isPickup ?? false)
  const [quota, setQuota] = useState<number | null>(resource?.quota ?? null)
  const [selectedField, setSelectedField] = useState<keyof PatternType>(
    resource?.selectedField ?? 'months'
  )
  const [promoted, setPromoted] = useState(resource?.promoted ?? false)

  const handleFormSubmit = async (e: FormEvent) => {
    console.log('handleFormSubmit')
    e.preventDefault()
    const userId = auth.currentUser?.uid
    if (!userId) {
      alert('User not logged in')
      return
    }

    const resourceRef = resource
      ? doc(db, 'resources', resource.id)
      : doc(collection(db, 'resources'))
    const newImageUrls = await Promise.all(
      selectedImages.map(async (selectedImage, index) => {
        const imagePath = `resources/${resourceRef.id}/${index}`
        const imageRef = ref(storage, imagePath)
        await uploadBytes(imageRef, selectedImage.file)
        return await getDownloadURL(imageRef)
      })
    )
    const newVideoUrls = await Promise.all(
      videoFiles.map(async (videoFile, index) => {
        const videoPath = `resources/${resourceRef.id}/videos/${index}`
        const videoRef = ref(storage, videoPath)
        await uploadBytes(videoRef, videoFile)
        return await getDownloadURL(videoRef)
      })
    )

    if (addNewResourceGroup) {
      // Save the new resource group to Firestore with the user ID
      await addDoc(collection(db, 'resourceGroups'), {
        name: resourceGroupName,
        userId
      })
    }
    if (addNewResourceCategory) {
      // Save the new resource group to Firestore with the user ID
      await addDoc(collection(db, 'resourceCategories'), {
        name: resourceCategoryName,
        userId
      })
    }
    await setDoc(resourceRef, {
      userId,
      resourceCategoryName,
      title,
      description,
      price,
      availability: availabilityPatterns.map(pattern => pattern.toString()),
      images: [...imageUrls, ...newImageUrls],
      primaryImageIndex,
      availableResources,
      isGroupClosed,
      resourceGroupName,
      videos: newVideoUrls,
      address: addressData.address,
      lat: addressData.lat,
      lng: addressData.lng,
      radius: radius,
      isPickup,
      createdAt: new Date(),
      quota,
      selectedField,
      promoted
    })
    onSubmit()
  }

  const getQuotaMinMax = (selectedField: keyof PatternType) => {
    // Define your custom min and max values for each time period
    const minMaxMap: Record<keyof PatternType, { min: number; max: number }> = {
      minutes: { min: 1, max: 59 },
      hours: { min: 1, max: 23 },
      daysOfMonth: { min: 1, max: 31 },
      months: { min: 1, max: 12 },
      daysOfWeek: { min: 1, max: 7 }
    }

    return minMaxMap[selectedField] || { min: 1, max: 100 }
  }
  const onQuotaChange = (
    quotaValue: number,
    selectedField: keyof PatternType
  ) => {
    const { min, max } = getQuotaMinMax(selectedField)
    if (quotaValue < min) {
      setQuota(min)
    } else if (quotaValue > max) {
      setQuota(max)
    } else {
      setQuota(quotaValue)
    }
  }

  const handlePatternChange = (value: string) => {
    setCurrentPattern(value)
  }

  const addAvailabilityPattern = () => {
    if (currentPattern !== '') {
      try {
        const pattern = new AvailabilityPattern(currentPattern)
        setAvailabilityPatterns([...availabilityPatterns, pattern])
      } catch (error) {
        console.error('Invalid pattern addAvailabilityPattern:', error)
      }
      setCurrentPattern('')
    }
  }

  const editAvailabilityPattern = (index: number) => {
    const patternToEdit = availabilityPatterns[index].toString()
    setCurrentPattern(patternToEdit)
    setAvailabilityPatterns(availabilityPatterns.filter((_, i) => i !== index))
  }

  useEffect(() => {
    const fetchResourceGroupNames = async () => {
      const userId = auth.currentUser?.uid
      if (!userId) {
        alert('User not logged in')
        return
      }

      const q = query(
        collection(db, 'resourceGroups'),
        where('userId', '==', userId)
      )
      const querySnapshot = await getDocs(q)
      const names: string[] = []
      querySnapshot.forEach(doc => {
        names.push(doc.data().name)
      })
      setResourceGroupNames(names)
    }
    fetchResourceGroupNames()
  }, [])
  useEffect(() => {
    setFormValid(
      !!title &&
        !!description &&
        !!price &&
        !!(availabilityPatterns.length > 0) &&
        !!addressData.address &&
        !!addressData.lat &&
        !!addressData.lng
    )
  }, [title, description, price, availabilityPatterns, addressData])

  useEffect(() => {
    const totalSize = videoFiles.reduce((acc, video) => acc + video.size, 0)

    if (totalSize > 200 * 1024 * 1024) {
      //setSubmitDisabled(true);
      console.log('The total size of the selected video files exceeds 200 MB.')
    } else {
      //setSubmitDisabled(false);
    }
  }, [videoFiles])

  const handleDelete = async () => {
    if (!resource) return
    await deleteDoc(doc(db, 'resources', resource.id))
    onSubmit()
  }

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newSelectedImages = Array.from(e.target.files)
      .filter(file => !file.name.startsWith('.'))
      .map(file => ({
        file,
        url: URL.createObjectURL(file)
      }))
      .filter(
        newImage =>
          !selectedImages.some(
            selectedImage => selectedImage.file.name === newImage.file.name
          )
      )

    const combinedImages = [...selectedImages, ...newSelectedImages]

    const totalSize = combinedImages.reduce(
      (acc, image) => acc + image.file.size,
      0
    )

    if (totalSize > 200 * 1024 * 1024) {
      alert('The total size of the selected images exceeds 200 MB.')
      return
    }

    setSelectedImages(combinedImages)

    // Reset the input value
    e.target.value = ''
  }

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index))

    // Reset the input value
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }
  const handlePrimaryImage = (value: number) => {
    setPrimaryImageIndex(value)
  }
  const handleVideoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setVideoFiles(
      Array.from(e.target.files).filter(file => !file.name.startsWith('.'))
    )
  }
  const fields = ['hours', 'daysOfMonth', 'months', 'daysOfWeek']

  return (
    <Container>
      <Box mt={4} textAlign='center'>
        <Typography variant='h4' gutterBottom style={{ color: blue[500] }}>
          {editMode ? 'Edit Resource' : 'Add Resource'}
        </Typography>
      </Box>
      <Form onSubmit={handleFormSubmit}>
        <StyledCard>
          <CardContent>
            <Typography variant='h5'>General Information</Typography>

            <Form.Group className='mb-3' controlId='resourceCategoryName'>
              <Form.Label>Resource Category Name</Form.Label>

              {addNewResourceCategory ? (
                <Form.Control
                  type='text'
                  placeholder='Enter Category Name'
                  value={resourceCategoryName}
                  onChange={e => setResourceCategoryName(e.target.value)}
                />
              ) : (
                <Form.Select
                  value={resourceCategoryName}
                  onChange={e => {
                    const selectedValue = e.target.value
                    if (selectedValue === 'add-new') {
                      setAddNewResourceCategory(true)
                      setResourceCategoryName('')
                    } else {
                      setResourceCategoryName(selectedValue)
                    }
                  }}
                >
                  <option value='' disabled>
                    Select a Resource Category
                  </option>
                  {resourceCategoryNames.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                  <option value='add-new'>Add New Resource Category</option>
                </Form.Select>
              )}
            </Form.Group>

            <Form.Group className='mb-3' controlId='title'>
              <Form.Label>Title *</Form.Label>

              <Form.Control
                type='text'
                placeholder='Enter title'
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='description'>
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as='textarea'
                placeholder='Enter description'
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Price *</Form.Label>
              <PriceTag
          value={price}
          onChange={(newPrice) => setPrice(newPrice)}
        />

              {/* <InputGroup>
                <Form.Control
                  type='number'
                  placeholder='Enter price'
                  value={price || 0}
                  onChange={e =>
                    setPrice(e.target.value ? parseFloat(e.target.value) : 0)
                  }
                  required
                />
                <Form.Select
                  value={currency}
                  onChange={e =>
                    setCurrency(e.target.value as 'USD' | 'EUR' | 'CAD' | 'MXN')
                  }
                >
                  <option value='USD'>USD</option>
                  <option value='EUR'>EUR</option>
                  <option value='CAD'>CAD</option>
                  <option value='MXN'>MXN</option>
                </Form.Select>
              </InputGroup> */}
            </Form.Group>
            <Form.Group className='mb-3' controlId='isGroupClosed'>
              <Form.Check
                type='checkbox'
                label='Closed group (only admin can invite)'
                checked={isGroupClosed}
                onChange={e => setIsGroupClosed(e.target.checked)}
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='resourceGroupName'>
              <Form.Label>Resource Group Name</Form.Label>
              {addNewResourceGroup ? (
                <Form.Control
                  type='text'
                  placeholder='Enter resource group name'
                  value={resourceGroupName}
                  onChange={e => setResourceGroupName(e.target.value)}
                />
              ) : (
                <Form.Select
                  value={resourceGroupName}
                  onChange={e => {
                    const selectedValue = e.target.value
                    if (selectedValue === 'add-new') {
                      setAddNewResourceGroup(true)
                      setResourceGroupName('')
                    } else {
                      setResourceGroupName(selectedValue)
                    }
                  }}
                >
                  <option value='' disabled>
                    Select a Resource Group
                  </option>
                  {resourceGroupNames.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                  <option value='add-new'>Add New Resource Group</option>
                </Form.Select>
              )}
            </Form.Group>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardContent>
            <Typography variant='h5'>Location</Typography>
            <Form.Group className='mb-3' controlId='address'>
              <Form.Label>Address *</Form.Label>
              <AddressCollector
                initialPosition={{
                  lat: addressData.lat,
                  lng: addressData.lng
                }}
                onLocationChange={(address, position) =>
                  setAddressData({ ...position, address })
                }
              />{' '}
            </Form.Group>

            <Form.Group className='mb-3' controlId='isPickup'>
              <Form.Check
                type='checkbox'
                label='Item is picked up (not sent)'
                checked={isPickup}
                onChange={e => setIsPickup(e.target.checked)}
              />
            </Form.Group>
            {!isPickup && (
              <Form.Group className='mb-3' controlId='radius'>
                <Form.Label>Delivery Radius *</Form.Label>
                <InputGroup>
                  <Form.Control
                    type='number'
                    placeholder='Enter delivery radius'
                    value={radius || ''}
                    onChange={e =>
                      setRadius(
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                    required
                  />
                  <Form.Select
                    value={radiusUnit}
                    onChange={e =>
                      setRadiusUnit(e.target.value as 'miles' | 'km')
                    }
                  >
                    <option value='miles'>Miles</option>
                    <option value='km'>Kilometers</option>
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            )}
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardContent>
            {/* <Typography variant='h5'>Availability</Typography> */}
            <Typography variant='h4' gutterBottom style={{ color: blue[500] }}>
              {editMode ? 'Edit Availability' : 'Add Availability'}
            </Typography>
            <List>
              {availabilityPatterns.map((pattern, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Pattern ${index + 1}: ${pattern.toString()}`}
                  />
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={() => editAvailabilityPattern(index)}
                  >
                    Edit
                  </Button>
                </ListItem>
              ))}
            </List>
            <AvailabilityPatternForm
              value={currentPattern}
              onChange={handlePatternChange}
              onAddPattern={addAvailabilityPattern}
              fields={fields as (keyof PatternType)[]}
              showInterval={false}
              showAny={false}
            />
            <Button
              variant='contained'
              color='primary'
              onClick={addAvailabilityPattern}
            >
              <AddIcon />
            </Button>
            <Form.Group className='mb-3' controlId='availableResources'>
              <Form.Label>Number of Available Resources *</Form.Label>
              <Form.Control
                type='number'
                min={1}
                value={availableResources}
                onChange={e => setAvailableResources(parseInt(e.target.value))}
              />
            </Form.Group>
            <Box marginTop={2}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <FormLabel component='legend'>Quota</FormLabel>
                    <TextField
                      type='number'
                      value={quota || 0}
                      onChange={e =>
                        onQuotaChange(parseInt(e.target.value), selectedField)
                      }
                      fullWidth
                      inputProps={{
                        ...getQuotaMinMax(selectedField)
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <FormLabel component='legend'>Time Period</FormLabel>

                    <Select
                      value={selectedField || ''}
                      onChange={e => {
                        setSelectedField(e.target.value as keyof PatternType)
                        onQuotaChange(
                          quota ? quota : 0,
                          e.target.value as keyof PatternType
                        )
                      }}
                    >
                      {fields?.map(field => (
                        <MenuItem key={field} value={field}>
                          {field}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardContent>
            <Typography variant='h5'>Multimedia</Typography>

            <Form.Group className='mb-3'>
              <Form.Label>Video</Form.Label>
              <input
                type='file'
                multiple
                accept='video/*'
                onChange={handleVideoSelect}
                style={{ display: 'block' }}
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Images</Form.Label>
              <input
                type='file'
                multiple
                accept='image/*'
                onChange={handleImageSelect}
                {...({ webkitdirectory: 'true', directory: 'true' } as any)}
                style={{ display: 'block' }}
              />
              {selectedImages.map((image, index) => (
                <div
                  key={index}
                  className='mb-2'
                  style={{ position: 'relative', display: 'inline-block' }}
                >
                  <img
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    width='200'
                    height='200'
                    className='me-2'
                    style={{ objectFit: 'cover' }}
                  />
                  <IconButton
                    size='small'
                    color='success'
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    onClick={() => handlePrimaryImage(index)}
                  >
                    {primaryImageIndex === index ? (
                      <CheckBox fontSize='small' />
                    ) : (
                      <CheckBoxOutlineBlank fontSize='small' />
                    )}
                  </IconButton>
                  <IconButton
                    size='small'
                    color='info'
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      padding: '10px'
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Delete fontSize='small' />
                  </IconButton>
                </div>
              ))}
            </Form.Group>
          </CardContent>
        </StyledCard>
        {userRole === 'admin' && (
          <FormControlLabel
            control={
              <Checkbox
                checked={promoted}
                onChange={e => setPromoted(e.target.checked)}
                color="primary"
              />
            }
            label="Promote this resource"
          />
        )}
        {availabilityPatternError && (
          <Alert severity='error' style={{ marginTop: 16 }}>
            {availabilityPatternError}
          </Alert>
        )}
        {/* <Button variant="primary" type="submit" disabled={!formValid}> */}
        <div style={{ position: 'relative', zIndex: 1000 }}>
          <Button variant='primary' type='submit' disabled={false}>
            {resource ? 'Update' : 'Add'} Resource
          </Button>
        </div>
        {resource && (
          <Button variant='danger' onClick={handleDelete} className='ms-3'>
            Delete Resource
          </Button>
        )}
      </Form>
    </Container>
  )
}

export default ResourceForm
