// src/components/Home.jsx
import React, { useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../api/axios";

const Home = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/api/logout", {
        refreshToken: localStorage.getItem("refreshToken"),
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      {/* Fixed header bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#343a40",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1030,
        }}
      >
        <div>
          Welcome, <strong>{user?.name || "User"}</strong>
        </div>
        <Button color="danger" onClick={handleLogout} size="sm">
          Logout
        </Button>
      </div>

      {/* Add padding top so content doesn't go under fixed header */}
      <Container style={{ paddingTop: "70px" }}>
        <Row className="g-4">
          <Col md="4">
            <Card>
              <CardBody>
                <CardTitle tag="h5" className="mb-3">
                  Admin Panel
                </CardTitle>
                <p>
                  This is a dummy admin panel created with React, React Router
                  and Reactstrap.
                </p>
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card>
              <CardBody>
                <CardTitle tag="h5" className="mb-3">
                  Features
                </CardTitle>
                {/* Use div, not CardText, to avoid <p> wrapping <ul> */}
                <div>
                  <ul>
                    <li>User registration and login</li>
                    <li>User context to store user data</li>
                    <li>Protected routes</li>
                    <li>REST API for authentication</li>
                    <li>Simple database configuration</li>
                  </ul>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card>
              <CardBody>
                <CardTitle tag="h5" className="mb-3">
                  Technologies Used
                </CardTitle>
                <div>
                  <ul>
                    <li>React</li>
                    <li>React Router</li>
                    <li>Reactstrap</li>
                    <li>Node.js</li>
                    <li>Express</li>
                    <li>PostgreSQL</li>
                  </ul>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
