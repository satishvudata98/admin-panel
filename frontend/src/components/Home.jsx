import React, { useContext } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Home = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md="12" style={{position: 'fixed', top: 0, right: 0}}>
          <Button color="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle>Welcome to Admin Panel</CardTitle>
              <CardText>
                This is a dummy admin panel created with React, React Router and Reactstrap.
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle>Features</CardTitle>
              <CardText>
                <ul>
                  <li>User registration and login</li>
                  <li>User context to store user data</li>
                  <li>Protected routes</li>
                  <li>REST API for authentication</li>
                  <li>Simple database configuration</li>
                </ul>
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle>Technologies Used</CardTitle>
              <CardText>
                <ul>
                  <li>React</li>
                  <li>React Router</li>
                  <li>Reactstrap</li>
                  <li>Node.js</li>
                  <li>Express</li>
                  <li>PostgreSQL</li>
                </ul>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;

