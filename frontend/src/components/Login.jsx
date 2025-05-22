import React, { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  Alert,
  Spinner
} from "reactstrap";
import { UserContext } from '../context/UserContext';
import api from '../api/axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const location = useLocation();
  const sessionExpired = location.state?.sessionExpired;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post('/api/login', { email, password });
      
      if (!response.data) {
        throw new Error("No data received from server");
      }

      const { user, accessToken, refreshToken } = response.data;
      
      if (!user || !accessToken || !refreshToken) {
        throw new Error("Invalid response format");
      }

      login(user, { accessToken, refreshToken });
      
      // Clear any session expired state when logging in successfully
      navigate('/home', { 
        replace: true,
        state: {} // Clear the location state
      });
    } catch (err) {
      let errorMessage = "Login failed. Please check your credentials and try again.";
      
      if (err.response) {
        // Handle HTTP errors
        if (err.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        // Handle other errors
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={4}>
          <Card className="shadow-sm">
            <CardBody>
              <CardTitle tag="h3" className="text-center mb-4">
                Admin Panel Login
              </CardTitle>
              
              {/* Session expired message */}
              {sessionExpired && (
                <Alert color="warning" className="text-center mb-3">
                  Your session has expired. Please login again.
                </Alert>
              )}
              
              {/* Error message from login attempt */}
              {error && (
                <Alert color="danger" className="text-center mb-3">
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleLogin}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoFocus
                    disabled={loading}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </FormGroup>
                
                <div className="d-grid gap-2 mt-4">
                  <Button 
                    type="submit" 
                    color="primary" 
                    disabled={loading}
                    className="py-2"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Logging in...
                      </>
                    ) : "Login"}
                  </Button>
                </div>
              </Form>
              
              <div className="mt-4 text-center">
                <p className="text-muted mb-2">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary fw-semibold">
                    Register here
                  </Link>
                </p>
                {/*
                <p className="text-muted mb-0">
                  <Link to="/forgot-password" className="text-primary">
                    Forgot password?
                  </Link>
                </p>
                */}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;