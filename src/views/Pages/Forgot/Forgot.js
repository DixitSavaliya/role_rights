import React, { Component } from 'react';
import { Alert, Container, CardHeader, Form, InputGroupText, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import './forgot.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

class Forgot extends Component {
  constructor(props) {
    super(props);
  }

  forgotPassword() {
    const data = {
      username: this.state.username
    }
    this.props.ForgotPassword(data).then((res) => {
      if (res.response.status == 1) {
        Swal.fire({
          text: res.response.message,
          icon: 'success'
        });
      } else {
        Swal.fire({
          text: res.response.message,
          icon: 'warning'
        });
      }
    });
  }


  render() {
    const { auth } = this.props;
    const { fetching, error } = auth;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>ForgotPassword</h1>
                    <InputGroup className="mb-3">
                      <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                      <Input
                        type="text"
                        name="username"
                        className="form-control"
                        onChange={(e) => this.setState({
                          username: e.target.value.trim()
                        })
                        }
                        placeholder="Username"
                        autoComplete="username"
                      />
                    </InputGroup>
                    {error ?
                      (<Alert color="danger">
                        {error}
                      </Alert>) : (<div />)
                    }
                    <Row>
                      <Col xs="6">
                        <Button color="primary" className="px-4"
                          onClick={this.forgotPassword.bind(this)}
                          disabled={fetching}
                        >ForgotPassword</Button>
                      </Col>
                      <Col xs="6" className="right">
                        <Link to="/login"> <Button color="primary" className="px-4"
                        >Back To Login </Button></Link>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Forgot;
