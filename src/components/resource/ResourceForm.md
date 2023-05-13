```typescript

import React, {
  ChangeEvent,
  FormEvent,
  useState,
  useEffect,
  useRef
} from 'react'
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

import { getAuth } from 'firebase/auth'

import { AvailabilityPatternForm, PatternType } from './AvailabilityPatternForm'
import { useAppSelector } from '../../app/hooks'

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
  billingFrequency: 'month',
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


```
