import React, { useEffect, useState } from 'react'
import {
  Container,
  Form,
  InputGroup,
  Button,
  Modal,
  FormGroup,
  Col,
  Row,
  Card
} from 'react-bootstrap'
import { AddressCollector, Position } from '../location/AddressCollector'
import IconButton from '@mui/material/IconButton'
import MapIcon from '@mui/icons-material/Map'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/system'
// import { Circle } from '@react-google-maps/api';
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { firebaseApp } from '../../config/firebase'
import { getFirestore } from '@firebase/firestore'
import { ResourceType } from '../resource/ResourcesList'

const db = getFirestore(firebaseApp)

const LargerMapIcon = styled(MapIcon)({
  fontSize: '2rem'
})

const MapIconWrapper = styled(IconButton)({
  paddingRight: '30px',
  paddingLeft: '0px'
})

const CustomCard = styled(Card)({
  border: '1px solid #aaa',
  position: 'relative',
  '& .header': {
    position: 'absolute',
    top: '-10px',
    background: '#fff',
    left: '10px',
    padding: '0 10px'
  },
  '& .card-body': {
    minHeight: '70px' // Ensures all sections have the same minimum height
  }
})

const RadiusWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px' // Adds space between label and input
})

export type SearchType = {
  category: string
  radius: number
  location: string
  freeText: string
}

const SearchInput = styled(Form.Control)({
  height: '38px'
})

type SearchBoxProps = {
  search: SearchType;
  setSearch: React.Dispatch<React.SetStateAction<SearchType>>;
  embedded?: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;

};

export default function SearchBox({handleSubmit, embedded, search, setSearch}: SearchBoxProps) {
  const [open, setOpen] = useState(false)
  const [resources, setResources] = useState<ResourceType[]>([])


  useEffect(() => {
    const resourcesQuery = query(collection(db, 'resources'), orderBy('title'))
    const unsubscribe = onSnapshot(resourcesQuery, (snapshot) => {
      const resourcesData: ResourceType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ResourceType[]
      setResources(resourcesData)
    })

    return () => {
      unsubscribe()
    }
  }, [search]) // Perform the search whenever the search state changes

  const [addressData, setAddressData] = useState({
    address: '',
    lat: 0,
    lng: 0
  })
  const useMetric = () => {
    const locale = navigator.language
    const hasMetricLocale = ['US', 'LR', 'MM'].every(
      metricLocale => !locale.includes(metricLocale)
    )
    return hasMetricLocale
  }

  const unit = useMetric() ? 'km' : 'mile'
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleLocationChange = (address: string, position: Position) => {
    setAddressData({ address: address, lat: position.lat, lng: position.lng })
    handleClose()
  }

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target
    setSearch(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target
    setSearch(prevState => ({ ...prevState, [name]: value }))
  }

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()
  //   if (embedded) {
  //     //navigate(`/search`)
  //     history.push('/search', { search });
  //   } else {
  //   }
  // }

  return (
    <Container>
      <Card className='mb-4'>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className='justify-content-md-center'>
              <Col md={2}>
                <CustomCard className='mb-4'>
                  <div className='header'>Category</div>
                  <Card.Body>
                    <FormGroup controlId='category'>
                      <Form.Select
                        name='category'
                        value={search.category}
                        onChange={handleSelectChange}
                      >
                        <option value=''>Yacht</option>
                        <option value='yacht'>Yacht</option>
                        <option value='parking'>Parking</option>
                      </Form.Select>
                    </FormGroup>
                  </Card.Body>
                </CustomCard>
              </Col>
              <Col md={6}>
                <CustomCard className='mb-4'>
                  <div className='header'>Location and Radius</div>
                  <Card.Body>
                    <FormGroup controlId='location'>
                      <Row>
                        <Col md={5}>
                          <Form.Control
                            readOnly
                            value={addressData.address || 'Select location'}
                          />
                        </Col>
                        <Col md={5}>
                          <Form.Group controlId='radius'>
                            <Row>
                              <Col md={6}>
                                <Form.Select
                                  name='radius'
                                  value={search.radius}
                                  onChange={handleInputChange}
                                >
                                  {[...Array(9)].map((_, i) => {
                                    const value = (i + 2) * 10 // values from 20 to 100
                                    return (
                                      <option key={value} value={value}>
                                        {value}
                                      </option>
                                    )
                                  })}
                                </Form.Select>
                              </Col>
                              <Col md={6}>
                                <Form.Select
                                  name='unit'
                                  // value={search.unit}
                                  onChange={handleInputChange}
                                >
                                  {['km', 'miles'].map((value, i) => {
                                    return (
                                      <option key={value} value={value}>
                                        {value}
                                      </option>
                                    )
                                  })}
                                </Form.Select>
                              </Col>
                            </Row>
                          </Form.Group>

                          {/* <Form.Control
                              name='radius'
                              type='number'
                              value={search.radius}
                              onChange={handleInputChange}
                            /> */}
                        </Col>
                        <Col md={1}>
                          <MapIconWrapper onClick={handleClickOpen}>
                            <LargerMapIcon />
                          </MapIconWrapper>
                          <Modal show={open} onHide={handleClose}>
                            <Modal.Header>
                              Select a location
                              <IconButton
                                edge='end'
                                color='inherit'
                                onClick={handleClose}
                                aria-label='close'
                              >
                                <CloseIcon />
                              </IconButton>
                            </Modal.Header>
                            <Modal.Body>
                              <AddressCollector
                                onLocationChange={handleLocationChange}
                              />
                            </Modal.Body>
                          </Modal>
                        </Col>
                      </Row>
                    </FormGroup>
                  </Card.Body>
                </CustomCard>
              </Col>
              <Col md={4}>
                <CustomCard className='mb-4'>
                  <div className='header'>Search Text</div>
                  <Card.Body>
                    <FormGroup controlId='freeText'>
                      <InputGroup className='mb-3'>
                        <SearchInput
                          name='freeText'
                          type='text'
                          value={search.freeText}
                          onChange={handleInputChange}
                          placeholder='Enter search text'
                        />
                        <Button type='submit' variant='primary' size='sm'>
                          <SearchIcon />
                        </Button>
                      </InputGroup>
                    </FormGroup>
                  </Card.Body>
                </CustomCard>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}
