import React from 'react'
import {
  Container,
  Card
} from 'react-bootstrap'
import TopResources from '../top_resources/TopResources'
import Search from '../search/Search'

export default function MainPage () {

  return (
    <Container>
      <Search embedded/>
      <Card>
        <TopResources />
      </Card>
    </Container>
  )
}
