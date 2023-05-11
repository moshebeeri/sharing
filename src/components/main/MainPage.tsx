import React, { useState } from 'react'
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
import SearchBox from './SearchBox'
import TopResources from '../top_resources/TopResources'

export default function MainPage () {

  return (
    <Container>
      <SearchBox />
      <Card>
        <TopResources />
      </Card>
    </Container>
  )
}
