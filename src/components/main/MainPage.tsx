import React, { useState } from 'react'
import { AddressCollector, Position } from '../location/AddressCollector'
import { Form, Button, InputGroup, Container, Modal, Col, Row } from 'react-bootstrap';
import { styled, Theme } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
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

// Define search type
type SearchType = {
  category: string
  radius: number
  location: string
  freeText: string
}

const StyledCard = styled(Card)`
  margin-bottom: 20px;
  border-radius: 5px;
  padding: 15px;
  border: 1px solid #ced4da;
`;

export default function MainPage () {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleLocationChange = (address: string, position: Position) => {
    // Handle location change...
    console.log(address, position)
    handleClose()
  }

  // Define state for search form
  const [search, setSearch] = useState<SearchType>({
    category: '',
    radius: 0,
    location: '',
    freeText: ''
  })

  // State for AddressCollector
  const [addressData, setAddressData] = useState({
    address: '',
    lat: 0,
    lng: 0
  })

  // Function to handle form input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setSearch(prevState => ({ ...prevState, [name]: value }))
  }

  // Function to handle form submit
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Call your search function here
    console.log(search)
  }

  return (
    <Container>
      <Box mt={4} textAlign='center'>
        <Typography variant='h4' gutterBottom style={{ color: blue[500] }}>
          Search
        </Typography>
      </Box>
      <Form onSubmit={handleSubmit}>
        <StyledCard>
          <CardContent>
            <Typography variant='h5'>General Information</Typography>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='category'>
                  <Form.Label>Choose category</Form.Label>
                  <Form.Control
                    type='text'
                    name='category'
                    value={search.category}
                    onChange={handleInputChange}
                    placeholder='Choose category'
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='radius'>
                  <Form.Label>Enter radius</Form.Label>
                  <Form.Control
                    type='number'
                    name='radius'
                    value={search.radius}
                    onChange={handleInputChange}
                    placeholder='Enter radius'
                  />
                </Form.Group>
              </Col>
              <Col>
                <Button variant='primary' onClick={handleClickOpen}>
                  Open Address Collector
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='freeText'>
                  <Form.Label>Enter search text</Form.Label>
                  <Form.Control
                    type='text'
                    name='freeText'
                    value={search.freeText}
                    onChange={handleInputChange}
                    placeholder='Enter search text'
                  />
                </Form.Group>
              </Col>
              <Col>
                <Button type='submit' variant='primary'>
                  Search
                </Button>
              </Col>
            </Row>
          </CardContent>
        </StyledCard>
        <Modal show={open} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Select a location</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddressCollector onLocationChange={handleLocationChange} />
          </Modal.Body>
        </Modal>
      </Form>
    </Container>
  )

}
