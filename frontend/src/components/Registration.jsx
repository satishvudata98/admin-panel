import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useNavigate } from 'react-router-dom';

import "./Registration.css";

function Registration() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState({});
  const { setUser } = useContext(UserContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setError({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setUser(res.data.user);
      setMessage(`User ${res.data.user.name} registered successfully!`);
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
      navigate('/');
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(`Registration failed: ${err.response.data.message}`);
      } else {
        setMessage("Registration failed. Email may already exist.");
      }
    }
  };

  return (
    <Container className="registration-container">
      <Row>
        <Col className="registration-card">
          <h2 className="registration-card-title">User Registration</h2>
          <Form onSubmit={handleSubmit} className="registration-card-form">
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                placeholder="Name"
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                placeholder="Email"
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                placeholder="Confirm Password"
                onChange={handleChange}
                required
              />
              {error.confirmPassword && (
                <div className="text-danger">{error.confirmPassword}</div>
              )}
            </FormGroup>
            <Button type="submit" color="primary" className="registration-card-submit">
              Register
            </Button>
            <br />
            <p className="text-dark">Already have an account? <a href="/" className="text-primary">Login here</a></p>
          </Form>
          <p className="text-success">{message}</p>
        </Col>
      </Row>
    </Container>
  );
}

export default Registration;

