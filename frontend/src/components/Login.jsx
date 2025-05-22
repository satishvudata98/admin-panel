import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import "./Login.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/login", { email, password })
      .then((response) => {
        if (response.data.message === "Login successful") {
          navigate("/home");
        } else {
          alert("Invalid credentials");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert(
          error.response?.data?.message || "An error occurred during login"
        );
      });
  };

  return (
    <Container className="login-container">
      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <Card className="login-card">
            <CardBody>
              <CardTitle tag="h5" className="text-center">
                Login
              </CardTitle>
              <Form onSubmit={handleLogin}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="form-control"
                  />
                </FormGroup>
                <Button
                  type="submit"
                  color="primary"
                  block
                  className="btn-block"
                >
                  Login
                </Button>
              </Form>
              <p className="register-link text-center">
                New user? <Link to="/register">Register</Link>
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
