import React, { Fragment } from 'react';
import { REMOTE_URL } from '../../redux/constants/index';
import { EventEmitter } from '../../event';
import { Link } from 'react-router-dom';
import checkRights from '../../rights';
import '../Viewapp/viewapp.css';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Collapse,
    DropdownItem,
    DropdownMenu,
    CardTitle,
    DropdownToggle,
    Fade,
    Form,
    CustomInput,
    FormGroup,
    FormText,
    FormFeedback,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButtonDropdown,
    InputGroupText,
    Label,
    Row,
} from 'reactstrap';
import Auth from '../../redux/Auth';

class ViewNotifications extends React.Component {

    /** First Constructor Call */
    constructor(props) {
        super(props);
        this.state = {
            application: [],
            searchData: '',
            App: '',
            id: '',
            appviewArray: '',
            rightdata:'',
            flag:1
        }
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
        if (this.props.id) {
            const obj = {
                shedule_id: this.props.id,
                user_id: this.props.auth.user.user_group_id
            }
            this.props.getViewNotificationsDetailsById(obj).then((res) => {
                this.setState({
                    App: this.state.App = res.response.data
                })
                this.setState({
                    appviewArray: this.state.appviewArray = this.state.App[0].app_list
                })
            })
        }
    }


    render() {
        return (
            <div>
                {(checkRights('notification', 'read') == true) ? (
                    <div>
                        {
                            this.state.appviewArray != null ? (
                                <div>
                                    <Row>
                                        <Col xs="12" sm="12" md="12" lg="12" xl="12">
                                            <Link to="/list-notifications">
                                                <Button className="mb-2 mr-2" color="primary">
                                                    Go back
                                                                                         </Button>
                                            </Link>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12" md="12" lg="12" xl="12">
                                            <Card className="main-card mb-3">
                                                <CardHeader>
                                                    <CardTitle
                                                        className="font"
                                                    >
                                                        Notification Detail
                                                                                                     </CardTitle>
                                                </CardHeader>
                                                <CardBody>
                                                    {
                                                        this.state.App.length > 0 ? (
                                                            <Row>
                                                                <Col md="4">
                                                                    <div>
                                                                        <h5>Title:</h5>
                                                                        <p className="blue">{this.state.App[0].title}</p>
                                                                    </div>

                                                                </Col>
                                                                <Col md="4">
                                                                    <div >
                                                                        <h5>Message:</h5>
                                                                        <p className="blue">{this.state.App[0].message}</p>
                                                                    </div>

                                                                </Col>
                                                                <Col md="4">

                                                                    <div>
                                                                        <h5 >URL:</h5>

                                                                        <p className="blue">{this.state.App[0].data.notification.url}</p>

                                                                    </div>

                                                                </Col>
                                                                <Col md="4">

                                                                    <div>
                                                                        <h5>Icon:</h5>
                                                                        {
                                                                            this.state.App[0].icon == null ? (
                                                                                <img src={require('./2.png')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                                                                            ) : (

                                                                                    <img src={REMOTE_URL + this.state.App[0].icon} className="avatar-img" alt="admin@bootstrapmaster.com" />
                                                                                )
                                                                        }

                                                                    </div>

                                                                </Col>
                                                                <Col md="4">

                                                                    <div>
                                                                        <h5>Click_Action:</h5>

                                                                        <p className="blue">{this.state.App[0].data.notification.click_action}</p>

                                                                    </div>

                                                                </Col>

                                                                <Col md="4" style={{ marginTop: '5px' }}>
                                                                    <div>
                                                                        <h5>Type:</h5>
                                                                        <div className="btn_size">
                                                                            {
                                                                                this.state.App[0].type == 1 ? (
                                                                                    <div>
                                                                                        <span className="badge badge-success">{this.state.App[0].type == 1 ? 'Sheduled' : ''}</span>
                                                                                        <p><b>Sheduled Time:</b> {this.state.App[0].time}</p>
                                                                                        <p><b>Sheduled Type:</b> {this.state.App[0].time_type == 1 ? 'Once' : (this.state.App[0].time_type == 2 ? 'Daily' : (this.state.App[0].time_type == 3 ? 'Weekly' : (this.state.App[0].time_type == 4 ? 'Monthly' : null)))}</p>
                                                                                    </div>
                                                                                ) : (
                                                                                        <span className="badge badge-danger">{this.state.App[0].type == 0 ? 'Immediate' : ''}</span>
                                                                                    )
                                                                            }
                                                                        </div>
                                                                    </div>

                                                                </Col>

                                                                <Col md="4">

                                                                    <div>
                                                                        <h5>True_Count:</h5>

                                                                        <p className="blue">{this.state.App[0].true_count}</p>
                                                                    </div>

                                                                </Col>

                                                                <Col md="4">

                                                                    <div>
                                                                        <h5>False_Count:</h5>

                                                                        <p className="blue">{this.state.App[0].false_count}</p>

                                                                    </div>

                                                                </Col>

                                                                <Col md="4">

                                                                    <div>
                                                                        <h5>Status:</h5>
                                                                        <div className="btn_size">
                                                                            {
                                                                                this.state.App[0].run_state == 1 ? (
                                                                                    <span className="badge badge-success">{this.state.App[0].run_state == "1" ? "Completed" : "Pending"}</span>
                                                                                ) : (
                                                                                        <span className="badge badge-danger">{this.state.App[0].run_state == "1" ? "Completed" : "Pending"}</span>
                                                                                    )
                                                                            }
                                                                        </div>

                                                                    </div>

                                                                </Col>



                                                            </Row>
                                                        ) : (
                                                                null
                                                            )
                                                    }

                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12" md="12" lg="12" xl="12">
                                            <Card className="main-card mb-3">
                                                <CardHeader>
                                                    <CardTitle
                                                        className="font"
                                                    >
                                                        Notification App List
                                                                                         </CardTitle>
                                                </CardHeader>
                                                <CardBody>
                                                    {
                                                        this.state.appviewArray.length > 0 ? (
                                                            <Row>
                                                                {
                                                                    this.state.appviewArray.map((data, index) =>
                                                                        <Col md="4" key={index}>
                                                                            <Form>
                                                                                <Card className="shadow_card">
                                                                                    <CardBody className="padding">
                                                                                        <Row>
                                                                                            <Col md="3">
                                                                                                <img src={REMOTE_URL + data.icon} className="app-img" alt="admin@bootstrapmaster.com" />
                                                                                            </Col>
                                                                                            <Col md="9" className="content">
                                                                                                <div className="app_detail">
                                                                                                    {/* <Input
                                                                                                                                                 type="checkbox"
                                                                                                                                                 id="no"
                                                                                                                                                 onChange={() => this.handleChange(data)}
                                                                                                                                                 checked={this.state.advertiserapp[index]['_rowChecked'] == true}
                                                                                                                                             /> */}
                                                                                                    <h5>{data.name}</h5>
                                                                                                    <h6>{data.package}</h6>
                                                                                                    {/* {
                                                                                                                                                 this.state.publisherapp[index]['_rowChecked'] == true ? (
                                                                                                                                                     <Button className="selectedP" color="primary" onClick={() => this.handleChange(data)}>
                                                                                                                                                         SELECTED
                                                                                                                                                 </Button>
                                                                         
                                                                                                                                                 ) : (
                                                                                                                                                         <Button className="selectP" color="primary" onClick={() => this.handleChange(data)}>
                                                                                                                                                             SELECT
                                                                                                                                                 </Button>
                                                                                                                                                     )
                                                                         
                                                                                                                                             } */}
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
                                                            // <Row>
                                                            //     {
                                                            //         this.state.appviewArray.map((data, index) =>
                                                            //             <Col md="4" key={index}>
                                                            //                 <Form>
                                                            //                     <Card className="shadow_card">

                                                            //                         <CardBody className="padding">
                                                            //                             <Row>
                                                            //                                 <Col md="2">
                                                            //                                     <img src={REMOTE_URL + data.icon} className="app-img" alt="admin@bootstrapmaster.com" />
                                                            //                                 </Col>
                                                            //                                 <Col md="10" className="content">
                                                            //                                     <div className="app_detail">
                                                            //                                         <h6>Name: <p>{data.name}</p></h6>
                                                            //                                         <h6>Package: <p>{data.package}</p></h6>
                                                            //                                     </div>
                                                            //                                 </Col>
                                                            //                             </Row>
                                                            //                         </CardBody>
                                                            //                     </Card>
                                                            //                 </Form>
                                                            //             </Col>
                                                            //         )
                                                            //     }
                                                            // </Row>
                                                        ) : (
                                                                null
                                                            )
                                                    }
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            ) : (
                                    <div>
                                        <Row>
                                            <Col xs="12" sm="12" md="12" lg="12" xl="12">
                                                <Link to="/list-notifications">
                                                    <Button className="mb-2 mr-2" color="primary">
                                                        Go back
                                                                                         </Button>
                                                </Link>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12" md="12" lg="12" xl="12">
                                                <Card className="main-card mb-3">
                                                    <CardHeader>
                                                        <CardTitle
                                                            className="font"
                                                        >
                                                            Notification Detail
                                                                                                     </CardTitle>
                                                    </CardHeader>
                                                    <CardBody>
                                                        {
                                                            this.state.App.length > 0 ? (
                                                                <Row>
                                                                    <Col md="4">
                                                                        <div>
                                                                            <h5 style={{ wordBreak: ' break-all' }}>Title:</h5>
                                                                            <p className="blue">{this.state.App[0].title}</p>
                                                                        </div>

                                                                    </Col>
                                                                    <Col md="4">
                                                                        <div >
                                                                            <h5 style={{ wordBreak: ' break-all' }}>Message:</h5>
                                                                            <p className="blue">{this.state.App[0].message}</p>
                                                                        </div>

                                                                    </Col>
                                                                    <Col md="4">

                                                                        <div>
                                                                            <h5>URL:</h5>

                                                                            <p className="blue">{this.state.App[0].data.notification.url}</p>

                                                                        </div>

                                                                    </Col>
                                                                    <Col md="4">

                                                                        <div>
                                                                            <h5>Icon:</h5>
                                                                            {
                                                                                this.state.App[0].icon == null ? (
                                                                                    <img src={require('./2.png')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                                                                                ) : (

                                                                                        <img src={REMOTE_URL + this.state.App[0].icon} className="avatar-img" alt="admin@bootstrapmaster.com" />
                                                                                    )
                                                                            }

                                                                        </div>

                                                                    </Col>
                                                                    <Col md="4">

                                                                        <div>
                                                                            <h5>Click_Action:</h5>

                                                                            <p className="blue">{this.state.App[0].data.notification.click_action}</p>

                                                                        </div>

                                                                    </Col>
                                                                    <Col md="4" style={{ marginTop: '5px' }}>
                                                                        <div>
                                                                            <h5>Type:</h5>
                                                                            <div className="btn_size">
                                                                                {
                                                                                    this.state.App[0].type == 1 ? (
                                                                                        <div>
                                                                                            <span className="badge badge-success">{this.state.App[0].type == 1 ? 'Sheduled' : ''}</span>
                                                                                            <p><b>Sheduled Time:</b> {this.state.App[0].time}</p>
                                                                                            <p><b>Sheduled Type:</b> {this.state.App[0].time_type == 1 ? 'Once' : (this.state.App[0].time_type == 2 ? 'Daily' : (this.state.App[0].time_type == 3 ? 'Weekly' : (this.state.App[0].time_type == 4 ? 'Monthly' : null)))}</p>
                                                                                        </div>
                                                                                    ) : (
                                                                                            <span className="badge badge-danger">{this.state.App[0].type == 0 ? 'Immediate' : ''}</span>
                                                                                        )
                                                                                }
                                                                            </div>
                                                                        </div>

                                                                    </Col>


                                                                    <Col md="4">

                                                                        <div>
                                                                            <h5>True_Count:</h5>

                                                                            <p className="blue">{this.state.App[0].true_count}</p>
                                                                        </div>

                                                                    </Col>

                                                                    <Col md="4">

                                                                        <div>
                                                                            <h5>False_Count:</h5>

                                                                            <p className="blue">{this.state.App[0].false_count}</p>

                                                                        </div>

                                                                    </Col>

                                                                    <Col md="4">

                                                                        <div>
                                                                            <h5>Status:</h5>
                                                                            <div className="btn_size">
                                                                                {
                                                                                    this.state.App[0].run_state == 1 ? (
                                                                                        <span className="badge badge-success">{this.state.App[0].run_state == "1" ? "Completed" : "Pending"}</span>
                                                                                    ) : (
                                                                                            <span className="badge badge-danger">{this.state.App[0].run_state == "1" ? "Completed" : "Pending"}</span>
                                                                                        )
                                                                                }
                                                                            </div>

                                                                        </div>

                                                                    </Col>

                                                                </Row>
                                                            ) : (
                                                                    null
                                                                )
                                                        }

                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </div>
                                )
                        }
                    </div>
                ) : (null)}
            </div>
        );
    }
}

export default ViewNotifications;