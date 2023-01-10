import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import AuthorList from './/components/AuthorList';
import ReactGA from 'react-ga';
  const TRACKING_ID = "UA-252982642-2"; 
  ReactGA.initialize(TRACKING_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);

const App = () => {
  const [name, setName] = useState('');
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT


  const handleSubmit = event => {
    event.preventDefault();
    // Track Submit in GA
    ReactGA.event({
      category: 'Submit',
      action: 'Submitted an author'
    });  
    // Set isLoading to true before sending the request
    setIsLoading(true);
    axios.get(`${API_ENDPOINT}/api/authors?name=${name}`)
      .then(response => {
        // Update the response state with the server's response
        setAuthors(response.data);
        // Set isLoading to false
        setIsLoading(false);
        // Reset isLoading to false after the response has been displayed
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={6}>
          <h1 className="text-center mb-3">Rechercher un auteur</h1>
          <p className="text-center mb-5">Entrer un nom pour rechercher si son oeuvre est dans le domaine public en France</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control type="text" value={name} onChange={event => setName(event.target.value)} />
            </Form.Group>
            <div className="text-center"style={{ marginTop: "5px", }}>
            <Button type="submit" variant="primary">Rechercher</Button>
            </div>
          </Form>
        </Col>
      </Row>
        
      {isLoading ? (

              <div style={{ marginTop: "10px", }}>

                <Container>
                    <Row>
                      <Col className="text-center">Loading...</Col>
                    </Row>
                </Container>

              </div>

              ) : (

              <div>
                {authors ? (
                  <Container style={{ marginTop: '20px' }}>
                    {authors.length > 0 && <AuthorList authors={authors} />}
                  </Container>
                ) : null}
              </div>


              )}


    </Container>






  );
};

export default App;
