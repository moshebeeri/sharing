import React, { useState } from "react";
import { Button, Col, Row, Container, Form, Navbar, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  //const user = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      const typedError = error as Error;
      setErrorMessage(typedError.message);
    }
  };

  return (
    <>
      <Navbar className="justify-content-between" bg="dark" variant="dark">
        <Navbar.Brand>Firebase Authentication</Navbar.Brand>
      </Navbar>
      <Container style={{ maxWidth: "500px", padding: "10px" }} fluid>
        <Form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          {errorMessage && (
            <Alert variant="danger" className="mt-3">
              {errorMessage}
            </Alert>
          )}
          <br />
          <Row>
            <Col xs={5}>
              <Button type="button" variant="secondary">
                Sign Up
              </Button>
            </Col>
            <Col xs={5}>
              <Button type="submit" >
                Sign In
              </Button>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Link to="/signup">Don't have an account? Sign up</Link>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}

export default Login;
