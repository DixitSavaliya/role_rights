import React, { Component } from 'react';
import { Alert, Container, Row, Col, CardGroup, Card, CardBody, Label, Button, Input, FormGroup, InputGroup, InputGroupAddon } from 'reactstrap';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

class Register extends Component {
  /** First Constructor Call */
  constructor(props) {
    super(props);
    this.state = {
      statuscheck1: true,
      status: 1,
      statuserror: '',
      password: '',
      passworderror: "",
      first_name: '',
      first_nameerror: "",
      last_name: '',
      last_nameerror: '',
      email_id: '',
      email_iderror: '',
      mobile_no: '',
      mobile_noerror: '',
      user_role_id: '',
      user_group: "advertiser",
      user_type: 1
    }
    this.onItemSelect = this.onItemSelect.bind(this);
    this.handleChangeEvent = this.handleChangeEvent.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
  }

  onItemSelect(event) {
    let _name = event.target.value;
    this.setState({
      customSelectName: this.state.customSelectName = _name
    })
  }

  componentDidMount() {
    const obj = {
      search_string: "Advertiser"
    }
    this.props.getUserRoleId(obj).then((res) => {
      this.setState({
        user_role_id: this.state.user_role_id = res.response.data[0].id
      })
    })
  }

  validate() {
    let passworderror = "";
    let first_nameerror = "";
    let last_nameerror = "";
    let mobile_noerror = "";
    let email_iderror = "";

    if (!this.state.first_name) {
      first_nameerror = "please enter first_name";
    }

    if (!this.state.password) {
      passworderror = "please enter password";
    }

    if (!this.state.last_name) {
      last_nameerror = "please enter last_name";
    }

    const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.state.email_id) {
      email_iderror = "please enter email";
    } else if (!reg.test(this.state.email_id)) {
      email_iderror = "invalid email";
    }

    const pattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    if (!pattern.test(this.state.mobile_no)) {
      mobile_noerror = "please enter mobile_number";
    }


    if (first_nameerror || passworderror || last_nameerror || mobile_noerror || email_iderror) {
      this.setState({ first_nameerror, passworderror, last_nameerror, mobile_noerror, email_iderror });
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

  handleChangeStatus(event) {
    if (event.target.value == 1) {
      this.setState({
        statuscheck1: this.state.statuscheck1 = event.target.checked,
        status: this.state.status = event.target.defaultValue,
        user_group: this.state.user_group = "advertiser",
        user_type: this.state.user_type = 1
      })
      const obj = {
        search_string: "Advertiser"
      }
      this.props.getUserRoleId(obj).then((res) => {
        this.setState({
          user_role_id: this.state.user_role_id = res.response.data[0].id
        })
      })
    } else {
      this.setState({
        statuscheck1: this.state.statuscheck1 = event.target.checked,
        status: this.state.status = event.target.defaultValue,
        user_group: this.state.user_group = "publisher",
        user_type: this.state.user_type = 2
      })
      const obj = {
        search_string: "Publisher"
      }
      this.props.getUserRoleId(obj).then((res) => {
        this.setState({
          user_role_id: this.state.user_role_id = res.response.data[0].id
        })
      })
    }

  }


  handleRegister(e) {
    const isValid = this.validate();
    if (isValid) {
      this.setState({
      
        passworderror: "",
     
        first_nameerror: "",
     
        last_nameerror: '',
      
        email_iderror: '',
     
        mobile_noerror: ''
      })
      if (this.state.first_name && this.state.password && this.state.last_name && this.state.email_id && this.state.mobile_no) {
        const obj = {
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          mobile_no: this.state.mobile_no,
          email_id: this.state.email_id,
          user_role_id: this.state.user_role_id,
          password: this.state.password,
          user_group: this.state.user_group,
          user_type: this.state.user_type,
          status: 1,
          create_by: 1
        }
        this.props.register(obj).then((res) => {
          if (res.response.status == 1) {
            Swal.fire("Users Login Details Created Successfully", "", "success");
            this.props.history.push(this.props.from || { pathname: '/login' });
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
            <Col md="5">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Register</h1>
                    <p className="text-muted">Sign Up to your account</p>
                    <InputGroup >
                      <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                      <Input
                        type="text"
                        name="first_name"
                        className="form-control"
                        onChange={this.handleChangeEvent}
                        placeholder="FirstName"
                        autoComplete="first_name"
                      />
                    </InputGroup>
                    <div className="mb-3" style={{ fontSize: 12, color: "red" }}>
                      {this.state.first_nameerror}
                    </div>
                    <InputGroup >
                      <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                      <Input
                        type="text"
                        name="last_name"
                        className="form-control"
                        onChange={this.handleChangeEvent}
                        placeholder="LastName"
                        autoComplete="last_name"
                      />
                    </InputGroup>
                    <div className="mb-3" style={{ fontSize: 12, color: "red" }}>
                      {this.state.last_nameerror}
                    </div>
                    <InputGroup >
                      <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                      <Input
                        type="email"
                        name="email_id"
                        className="form-control"
                        onChange={this.handleChangeEvent}
                        placeholder="EmailId"
                        autoComplete="email_id"
                      />
                    </InputGroup>
                    <div className="mb-3" style={{ fontSize: 12, color: "red" }}>
                      {this.state.email_iderror}
                    </div>
                    <InputGroup >
                      <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                      <Input
                        type="password"
                        name="password"
                        className="form-control"
                        onChange={this.handleChangeEvent}
                        placeholder="Password"
                        autoComplete="password"
                      />
                    </InputGroup>
                    <div className="mb-3" style={{ fontSize: 12, color: "red" }}>
                      {this.state.passworderror}
                    </div>
                    <InputGroup >
                      <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                      <Input
                        type="text"
                        name="mobile_no"
                        className="form-control"
                        onChange={this.handleChangeEvent}
                        placeholder="MobileNo"
                        autoComplete="mobile_no"
                      />
                    </InputGroup>
                    <div className="mb-3" style={{ fontSize: 12, color: "red" }}>
                      {this.state.mobile_noerror}
                    </div>
                    <InputGroup>
                      <FormGroup check inline>
                        <Input

                          type="radio"
                          id="inline-radio1"
                          defaultValue="1"
                          checked={this.state.status == 1 ? this.state.statuscheck1 : !this.state.statuscheck1}
                          name="status"
                          onChange={this.handleChangeStatus}
                        />
                        <Label
                          className="form-check-label"
                          check htmlFor="inline-radio1"
                        >
                          Advertiser
                        </Label>

                      </FormGroup>
                      <FormGroup check inline>
                        <Input

                          type="radio"
                          id="inline-radio2"
                          defaultValue="2"
                          checked={this.state.status == 2 ? this.state.statuscheck1 : !this.state.statuscheck1}
                          name="status"
                          onChange={this.handleChangeStatus}
                        />

                        <Label
                          className="form-check-label"
                          check htmlFor="inline-radio2"
                        >
                          Publisher
                        </Label>

                      </FormGroup>
                      <div  className="mb-3" style={{ fontSize: 12, color: "red" }}>
                        {this.state.statuserror}
                      </div>
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button type="button" color="primary" className="px-4"
                          onClick={this.handleRegister.bind(this)}
                        >Register</Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Link to="/login"><Button color="link" className="px-0">Back To Login</Button></Link>
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

export default Register;
