import React, { Component } from 'react';
import { Alert, Container, Row, Col, CardGroup, Card, CardBody, Button, Input, FormGroup, InputGroup, InputGroupAddon } from 'reactstrap';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import Auth from '../../../redux/Auth';

class Login extends Component {
  /** First Constructor Call */
  constructor(props) {
    super(props);
    this.state = {
      customSelectName: '',
      customSelectNameerror: '',
      password: '',
      passworderror: "",
      username: '',
      usernameerror: "",
      email_id: '',
      email_iderror: ''
    }
    this.onItemSelect = this.onItemSelect.bind(this);
    this.handleChangeEvent = this.handleChangeEvent.bind(this);
  }

  onItemSelect(event) {
    let _name = event.target.value;
    this.setState({
      customSelectName: this.state.customSelectName = _name
    })
  }

  validate() {
    let passworderror = "";
    let usernameerror = "";
    let customSelectNameerror = "";

    const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.state.username) {
      usernameerror = "please enter email";
    } else if (!reg.test(this.state.username)) {
      usernameerror = "please enter valid email";
    }

    if (!this.state.password) {
      passworderror = "please enter password";
    }

    if (!this.state.customSelectName) {
      customSelectNameerror = "please select role";
    }

    if (usernameerror || passworderror || customSelectNameerror) {
      this.setState({ usernameerror, passworderror, customSelectNameerror });
      return false;
    }
    return true;
  };

  /** onChange event  */
  handleChangeEvent(event) {
    event.preventDefault();
    const state = this.state
    state[event.target.name] = event.target.value;
    this.setState(state);
  }


  handleLogin(e) {
   
    const isValid = this.validate();
    if (isValid) {
      this.setState({
        passworderror: this.state.passworderror = '',
        usernameerror: this.state.usernameerror = ''
      })
      const obj = {
        username: this.state.username,
        password: this.state.password,
        user_group: this.state.customSelectName
      }
      if (this.state.username && this.state.password && this.state.customSelectName) {
        this.state['user_group'] = this.state.customSelectName;
        this.props.login(obj).then((res) => {
          if (res.response.status == 1) {
            this.props.getUser(res.response.data.id).then((res) => {
              if (res.response.status == 1) {
                Auth.authenticateUser(res.response.data);
                const obj = {
                  userRole: res.response.data.user_role_id
                }
                let _this = this;
                this.props.userroletoright(obj).then(function (res) {
                  let data = res.response.data;
                  Auth.setRight(data);
                  // window.sessionStorage.setItem('ad_network_auth_right', JSON.stringify(data));
                })
              } else {
                Swal.fire({
                  text: res.response.message,
                  icon: 'warning'
                });
              }
            });
          } else {
            Swal.fire({
              text: res.response.message,
              icon: 'warning'
            });
          }
        });
      }
    };
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup>
                      <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                      <Input
                        type="text"
                        name="username"
                        className="form-control"
                        onChange={this.handleChangeEvent}
                        placeholder="Username"
                        autoComplete="username"
                      />
                    </InputGroup>
                    <div className="mb-4" style={{ fontSize: 12, color: "red" }}>
                      {this.state.usernameerror}
                    </div>
                    <InputGroup>
                      <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                      <Input
                        type="password"
                        name="password"
                        className="form-control"
                        onChange={this.handleChangeEvent}
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </InputGroup>
                    <div className="mb-4" style={{ fontSize: 12, color: "red" }}>
                      {this.state.passworderror}
                    </div>
                    <InputGroup>
                      <InputGroupAddon><i className="fa fa-user-secret"></i></InputGroupAddon>
                      <Input
                        type="select"
                        name="customSelectName"
                        className="form-control"
                        onChange={this.onItemSelect}
                        placeholder="Select Role"
                      >
                        <option value="">Select Type:</option>
                        <option value="publisher">Publisher</option>
                        <option value="advertiser">Advertiser</option>
                      </Input>
                    </InputGroup>
                    <div className="mb-4" style={{ fontSize: 12, color: "red" }}>
                      {this.state.customSelectNameerror}
                    </div>
                    <Row>
                      <Col xs="6">
                        <Button type="button" color="primary" className="px-4"
                          onClick={this.handleLogin.bind(this)}
                        >Login</Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Link to="/forgot-password"><Button color="link" className="px-0">Forgot password?</Button></Link>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active>Register Now!</Button>
                      </Link>
                    </div>
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

export default Login;
