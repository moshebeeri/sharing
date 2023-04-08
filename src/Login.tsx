
import React, { useContext } from "react";
import { Button, Col, Row, Container, Form, Navbar } from "react-bootstrap";
import { AuthContext } from "./context/AuthContext";

function Login() {
  const user = useContext(AuthContext);

  return (
    <>
      <Navbar className="justify-content-between" bg="dark" variant="dark">
        <Navbar.Brand>Firebase Authentication</Navbar.Brand>
      </Navbar>
      <Container style={{ maxWidth: "500px", padding:"10px"}} fluid >
        <Form className="mt-4">
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="email" />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="password" />
          </Form.Group>
          <br/>
          <Row>
            <Col xs={5}>
              <Button type="button">
                Sign Up
              </Button>
            </Col>
            <Col xs={5}>
              <Button type="button" variant="secondary">
                Sign In
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}

export default Login;