import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import './dashboard.css';
import checkRights from '../../rights';
import { connect } from 'react-redux';
import { EventEmitter } from '../../event';
import {
  Badge,
  Row,
  Col,
  Progress,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Card,
  CardHeader,
  CardBody,
  Form,
  CardFooter,
  CardTitle,
  Button,
  ButtonToolbar,
  ButtonGroup,
  ButtonDropdown,
  Label,
  Input,
  Table,
  timeoutsShape
} from 'reactstrap';
import axios from 'axios';
import { REMOTE_URL } from '../../redux/constants/index';
import Auth from '../../redux/Auth';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      publisher: [],
      advertiser: [],
      name: '',
      display: false,
      flag: 1,
      rightdata: '',
      first_name: props.auth.user.first_name ? (props.auth.user.first_name) : (null)
    };
    this.handleChangeEvent = this.handleChangeEvent.bind(this);
    this.update = this.update.bind(this);
  }

  handleChangeEvent() {
    event.preventDefault();
    const state = this.state
    state[event.target.name] = event.target.value;
    this.setState(state);
    // this.setState({
    //   first_name:this.state.name
    // })
  }

  componentDidUpdate() {
    if (this.state.flag == 0) {
      this.setState({
        rightdata: this.state.rightdata = JSON.parse(Auth.getRight()),
        flag: this.state.flag = 1
      })
    }
  }

  componentDidMount() {
    EventEmitter.subscribe('updated_rights', (value) => {
      this.setState({ flag: this.state.flag = 0 });
    });
    if (this.props.auth.auth_data.user_group == "publisher") {
      let auth = this.props.auth.auth_data;
      axios.defaults.headers.post['Authorization'] = 'Barier ' + (auth ? auth.access_token : '');
      axios.defaults.headers.post['content-md5'] = auth ? auth.secret_key : '';
      let data = {
        publisher_id: this.props.auth.auth_data.id
      }
      axios.post(REMOTE_URL + "Application/getPublisherAppHitCount", data)
        .then(response => {
          this.setState({
            publisher: this.state.publisher = response.data.data
          })
        }).catch(error => {
          console.log("error", error);
        });

    } else {
      let auth = this.props.auth.auth_data;
      axios.defaults.headers.post['Authorization'] = 'Barier ' + (auth ? auth.access_token : '');
      axios.defaults.headers.post['content-md5'] = auth ? auth.secret_key : '';
      let data = {
        advertiser_id: this.props.auth.auth_data.id
      }
      axios.post(REMOTE_URL + "Application/getAdvertiserAppHitCount", data)
        .then(response => {
          this.setState({
            advertiser: this.state.advertiser = response.data.data
          })
        }).catch(error => {
          console.log("error", error);
        });
    }
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  update() {
    this.props.auth.user.first_name = this.state.name;
    this.props.changeName(this.props.auth.user);
  }


  render() {
    let auth = JSON.parse(window.sessionStorage.getItem('ad_network_user'));
    if (auth) {
      this.props.auth.user = auth;
    }

    return (
      <div className="animated fadeIn">
        {(checkRights('dashboard', 'read') == true) ? (
          <div>
            <div>
              {
                this.props.auth.auth_data.user_group == "publisher" || this.props.auth.auth_data.user_group == "advertiser" ? (
                  <div>
                    <h2>Hello, {this.props.auth.user.first_name} {this.props.auth.user.last_name}</h2>

                    {/* <h5>Welcome To Dashboard</h5> */}
                    {
                      this.props.auth.auth_data.user_group == "publisher" ? (
                        <p>Your Publisher ID is: {this.props.auth.auth_data.id}</p>
                      ) : (
                          ""
                        )
                    }
                    {
                      this.props.auth.auth_data.user_group == "publisher" ? (
                        <Card>
                          <CardHeader>
                            <strong style={{ color: '#20a8d8', fontSize: '20px' }}>Publisher App</strong>
                          </CardHeader>
                          <CardBody>
                            {
                              this.state.publisher.length > 0 ? (
                                <Row>
                                  {
                                    this.state.publisher.map((data, index) =>
                                      <Col sm="12" key={index}>
                                        <Form>
                                          <Card className="shadow_card">
                                            <CardBody className="padding">
                                              <Row>
                                                <Col sm="1">
                                                  <img src={REMOTE_URL + data.icon} style={{ height: '55px' }} className="app-img" alt="admin@bootstrapmaster.com" />
                                                </Col>
                                                <Col sm="3" className="content text-left">
                                                  <div className="app_detail">
                                                    <h5 style={{ wordBreak: ' break-all' }}>{data.name}</h5>
                                                    <h6 style={{ wordBreak: ' break-all' }}>{data.package}</h6>
                                                  </div>
                                                </Col>
                                                <Col sm="4">
                                                  <div className="text-center">
                                                    <label><strong>Hit Count</strong></label>
                                                    <div className="inline_content">
                                                      <h5>Today
                                              <p style={{ marginBottom: '0px' }} className="blue">{data.today_hit_count}</p>
                                                      </h5>
                                                      <h5>Total
                                              <p style={{ marginBottom: '0px' }} className="blue">{data.total_hit_count}</p>
                                                      </h5>
                                                    </div>
                                                  </div>
                                                </Col>
                                                <Col sm="4">
                                                  {/* <h5>Today Count:</h5>
                                      <p className="blue">{data.today_impression_count}</p>
                                      <h5>Total Count:</h5>
                                      <p className="blue">{data.total_impression_count}</p> */}
                                                  <div className="text-center">
                                                    <label><strong>Impression Count</strong></label>
                                                    <div className="inline_content">
                                                      <h5>Today
                                              <p style={{ marginBottom: '0px' }} className="blue">{data.today_impression_count}</p>
                                                      </h5>
                                                      <h5>Total
                                              <p style={{ marginBottom: '0px' }} className="blue">{data.total_impression_count}</p>
                                                      </h5>
                                                    </div>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </CardBody>
                                          </Card>
                                        </Form>
                                      </Col>
                                    )
                                  }

                                </Row>
                              ) : (
                                  null
                                )
                            }
                          </CardBody>
                        </Card>
                      ) : (
                          <Card>
                            <CardHeader>
                              <strong style={{ color: '#20a8d8', fontSize: '20px' }}>Advertiser App</strong>
                            </CardHeader>
                            <CardBody>
                              {
                                this.state.advertiser.length > 0 ? (
                                  <Row>
                                    {
                                      this.state.advertiser.map((data, index) =>
                                        <Col sm="12" key={index}>
                                          <Form>
                                            <Card className="shadow_card">
                                              <CardBody className="padding">
                                                <Row>
                                                  <Col sm="1">
                                                    <img src={REMOTE_URL + data.icon} style={{ height: '55px' }} className="app-img" alt="admin@bootstrapmaster.com" />
                                                  </Col>
                                                  <Col sm="6" className="content text-left">
                                                    <div className="app_detail">
                                                      <h5 style={{ wordBreak: ' break-all' }}>{data.name}</h5>
                                                      <h6 style={{ wordBreak: ' break-all' }}>{data.package}</h6>
                                                    </div>
                                                  </Col>
                                                  <Col sm="5">
                                                    <div className="text-center">
                                                      <label><strong>Impression Count</strong></label>
                                                      <div className="inline_content">
                                                        <h5>Today
                                              <p style={{ marginBottom: '0px' }} className="blue">{data.today_count}</p>
                                                        </h5>
                                                        <h5>Total
                                              <p style={{ marginBottom: '0px' }} className="blue">{data.total_count}</p>
                                                        </h5>
                                                      </div>
                                                    </div>
                                                  </Col>
                                                  {/* <Col sm="3">
                                      <h5>Today_Impression_Count:</h5>
                                      <p className="blue">{data.today_impression_count}</p>
                                      <h5>Total_Impression_Count:</h5>
                                      <p className="blue">{data.total_impression_count}</p>
                                    </Col> */}
                                                </Row>
                                              </CardBody>
                                            </Card>
                                          </Form>
                                        </Col>
                                      )
                                    }

                                  </Row>
                                ) : (
                                    null
                                  )
                              }
                            </CardBody>
                          </Card>
                        )
                    }
                  </div>
                ) : (
                    <div>
                      <h2>Hello, {this.props.auth.user.first_name} {this.props.auth.user.last_name}</h2>

                      <h5>Welcome To Dashboard</h5>
                      <FormGroup>
                        <Label htmlFor="name"><b>Data:</b></Label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          className="form-control"
                          onChange={this.handleChangeEvent}
                          placeholder="Enter Data"
                          required
                        />
                      </FormGroup>

                      <Button
                        color="primary"
                        className="mb-2 mr-2"
                        onClick={this.update}
                      >
                        update
                        </Button>
                    </div>
                  )
              }
            </div>
          </div>
        ) : (null)}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
  changeName: (user) => { dispatch({ type: 'CHANGE_NAME', payload: user }) }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
