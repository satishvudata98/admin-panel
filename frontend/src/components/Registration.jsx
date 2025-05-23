import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Spinner,
  FormFeedback
} from "reactstrap";
import { UserContext } from '../context/UserContext';
import api from '../api/axios';
import PropTypes from 'prop-types';
import './Registration.css';

const Registration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [serverMessage, setServerMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const { login } = useContext(UserContext);

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    if (!password) return '';
    if (password.length < 8) return 'Weak';
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecial].filter(Boolean).length;
    
    switch(strength) {
      case 4: return 'Very Strong';
      case 3: return 'Strong';
      case 2: return 'Medium';
      default: return 'Weak';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Calculate password strength in real-time
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Name validation
    if (!form.name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    } else if (form.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
      isValid = false;
    }
    
    // Email validation
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage({ text: '', type: '' });
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/api/register', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
      });
      
      const { user, accessToken, refreshToken } = response.data;
      login(user, { accessToken, refreshToken });
      
      setServerMessage({
        text: `Welcome ${user.name}! Registration successful. Redirecting...`,
        type: 'success'
      });
      // Simulate a delay for the success message
      await new Promise(resolve => setTimeout(resolve, 500));

      // setTimeout(() => {
        navigate('/home', { replace: true });
      // }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'This email is already registered.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setServerMessage({
        text: errorMessage,
        type: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 'Very Strong': return 'success';
      case 'Strong': return 'info';
      case 'Medium': return 'warning';
      case 'Weak': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container className="registration-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow-lg">
            <CardBody className="p-4">
              <div className="text-center mb-4">
                <CardTitle tag="h2" className="text-primary">
                  Create Account
                </CardTitle>
                <p className="text-muted">Join our platform today</p>
              </div>
              
              {serverMessage.text && (
                <Alert color={serverMessage.type} className="text-center">
                  {serverMessage.text}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit} noValidate>
                <FormGroup>
                  <Label for="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    invalid={!!errors.name}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                  <FormFeedback>{errors.name}</FormFeedback>
                </FormGroup>
                
                <FormGroup>
                  <Label for="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    invalid={!!errors.email}
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                  <FormFeedback>{errors.email}</FormFeedback>
                </FormGroup>
                
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    invalid={!!errors.password}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                  />
                  <FormFeedback>{errors.password}</FormFeedback>
                  {form.password && (
                    <div className="mt-2">
                      <small>Password Strength: </small>
                      <span className={`text-${getPasswordStrengthColor()}`}>
                        {passwordStrength || 'None'}
                      </span>
                      <div className="progress mt-1" style={{ height: '5px' }}>
                        <div
                          className={`progress-bar bg-${getPasswordStrengthColor()}`}
                          role="progressbar"
                          style={{
                            width: passwordStrength === 'Very Strong' ? '100%' :
                                  passwordStrength === 'Strong' ? '75%' :
                                  passwordStrength === 'Medium' ? '50%' :
                                  passwordStrength === 'Weak' ? '25%' : '0%'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </FormGroup>
                
                <FormGroup>
                  <Label for="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    invalid={!!errors.confirmPassword}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />
                  <FormFeedback>{errors.confirmPassword}</FormFeedback>
                </FormGroup>
                
                <FormGroup className="mt-4">
                  <Button
                    type="submit"
                    color="primary"
                    block
                    disabled={isSubmitting}
                    className="py-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Creating Account...
                      </>
                    ) : 'Register'}
                  </Button>
                </FormGroup>
              </Form>
              
              <div className="text-center mt-3">
                <p className="text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary fw-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
              
              <div className="text-center mt-3">
                <small className="text-muted">
                  By registering, you agree to our{' '}
                  <Link to="/terms" className="text-primary">
                    Terms of Service
                  </Link>
                </small>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

Registration.propTypes = {
  history: PropTypes.object
};

export default Registration;