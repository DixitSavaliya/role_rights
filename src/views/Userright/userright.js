import React, { Component } from 'react';
// import './userrole.css';
import TableRight from '../Tables/tableright';
import Swal from 'sweetalert2';
import checkRights from '../../rights';
import { EventEmitter } from '../../event';
import {
    Row,
    Col,
    Button,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Card,
    CardHeader,
    CardFooter,
    CardBody,
    Form,
    FormGroup,
    FormText,
    Label,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButton,

} from 'reactstrap';
import Auth from '../../redux/Auth';

class UserRight extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userright: '',
            userrighterror: '',
            displayname: '',
            displaynameerror: '',
            group_name: '',
            group_nameerror: '',
            group_display_name: '',
            group_display_nameerrror: '',
            updateRightBtn: false,
            rightId: '',
            searchData: '',
            delete: false,
            deletedata: '',
            isDisplay: false,
            flag:1,
            rightdata:''
        }
        this.userRightData = this.userRightData.bind(this);
        this.UpdateUserRightData = this.UpdateUserRightData.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.searchUserRightDataKeyUp = this.searchUserRightDataKeyUp.bind(this);
        this.handleChangeEvent = this.handleChangeEvent.bind(this);
        this.deleteAllUserRightData = this.deleteAllUserRightData.bind(this);
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

        EventEmitter.subscribe('rightIsDisplay', (value) => {
            this.setState({ isDisplay: this.state.isDisplay = true });
        });


        EventEmitter.subscribe('deletepageRightdata', (data) => {
            this.setState({
                deletedata: this.state.deletedata = data,
                delete: this.state.delete = true
            })
        });

        EventEmitter.subscribe('editRightData', (data) => {
            this.setState({
                updateRightBtn: this.state.updateRightBtn = true,
                rightId: this.state.rightId = data.id,
                userright: this.state.userright = data.name,
                displayname: this.state.displayname = data.display_name,
                group_name: this.state.group_name = data.group_name,
                group_display_name: this.state.group_display_name = data.group_display_name
            })
        });
    }


    validate() {
        let userrighterror = "";
        let displaynameerror = "";
        let group_display_nameerrror = "";
        let group_nameerror = "";

        if (!this.state.userright) {
            userrighterror = "please enter userright name";
        } else if (!this.state.userright.toLowerCase()) {
            userrighterror = "please enter userright name in lowercase"
        }

        if (!this.state.displayname) {
            displaynameerror = "please enter displayname";
        }

        if (!this.state.group_display_name) {
            group_display_nameerrror = "please enter group_display_name";
        }

        if (!this.state.group_name) {
            group_nameerror = "please enter group_name";
        }

        if (userrighterror || displaynameerror || group_display_nameerrror || group_nameerror) {
            this.setState({ userrighterror, displaynameerror, group_display_nameerrror, group_nameerror });
            return false;
        }
        return true;
    };


    userRightData() {
        const isValid = this.validate();
        if (isValid) {
            this.setState({

                userrighterror: this.state.userrighterror = '',

                displaynameerror: this.state.displaynameerror = '',

                group_nameerror: this.state.group_nameerror = '',

                group_display_nameerrror: this.state.group_display_nameerrror = ''
            })

            if (this.state.userright && this.state.displayname && this.state.group_name && this.state.group_display_name) {
                const data = {
                    name: this.state.userright.toLowerCase(),
                    display_name: this.state.displayname,
                    group_name: this.state.group_name,
                    group_display_name: this.state.group_display_name
                }
                this.props.addUserRight(data).then((res) => {
                    if (res.response.status == 1) {
                        Swal.fire({
                            text: res.response.message,
                            icon: 'success'
                        });
                        EventEmitter.dispatch('right_added', 1);
                    } else {
                        Swal.fire({
                            text: res.response.message,
                            icon: 'warning'
                        });
                    }

                });
            } else {
                Swal.fire("Please enter filed first!", "", "warning");
            }
        };
    }

    handleChangeStatus(event) {
        this.setState({
            statuscheck1: this.state.statuscheck1 = event.target.checked,
            status: this.state.status = event.target.defaultValue
        })
    }

    deleteAllUserRightData() {
        const role = {
            data: this.state.deletedata
        }
        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to delete?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value) {
                this.props.deleteRightData(role).then((res) => {
                    if (res.response.status == 1) {
                        Swal.fire({
                            text: res.response.message,
                            icon: 'success'
                        });
                        setTimeout(() => {
                            this.userRightData();
                        }, 1200)
                    } else {
                        Swal.fire({
                            text: res.response.message,
                            icon: 'warning'
                        });
                    }
                })
            }
        })
    }

    UpdateUserRightData() {
        const isValid = this.validate();
        if (isValid) {
            this.setState({

                userrighterror: this.state.userrighterror = '',

                displaynameerror: this.state.displaynameerror = '',

                group_nameerror: this.state.group_nameerror = '',

                group_display_nameerrror: this.state.group_display_nameerrror = ''
            })
            if (this.state.userright && this.state.displayname && this.state.group_name && this.state.group_display_name) {
                const obj = {
                    name: this.state.userright,
                    display_name: this.state.displayname,
                    group_name: this.state.group_name,
                    group_display_name: this.state.group_display_name,
                    id: this.state.rightId
                }
                this.props.updateRight(obj).then((res) => {
                    if (res.response.status == 1) {
                        Swal.fire({
                            text: res.response.message,
                            icon: 'success'
                        });
                        EventEmitter.dispatch('right_updated', 1);
                        this.setState({
                            updateRightBtn: this.state.updateRightBtn = false,
                        })

                    } else {
                        Swal.fire({
                            text: res.response.message,
                            icon: 'warning'
                        });
                    }

                });
            } else {
                Swal.fire("Please enter filed first!", "", "warning");
            }
        };
    };

    handleChangeEvent(e) {
        EventEmitter.dispatch('per_page_changed', e.target.value);
    }


    searchUserRightDataKeyUp(e) {
        const obj = {
            search_string: e.target.value
        }
        this.props.searchRight(obj);
        EventEmitter.dispatch('searchRightData', this.state.searchData);
    }

    render() {
        const { auth, rightCountData, RightPGData, deleteRightData } = this.props;
        this.state.searchData = this.props.auth.searchdata;
        const { fetching, error } = auth;

        return (
            <div className="animated fadeIn">
                {(checkRights('user_right','read') == true) ? (
                    <Row>
                        <Col xs="12" sm="12" md="12" lg="4" xl="4">
                            <Card>
                                <CardHeader>
                                    <strong>UserRight</strong>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col xs="12">
                                            <FormGroup>
                                                <Label htmlFor="userright">Right_Name:</Label>
                                                <Input
                                                    type="text"
                                                    id="userright"
                                                    name="userright"
                                                    className="form-control"
                                                    defaultValue={this.state.userright}
                                                    onChange={(e) =>
                                                        this.state.userright = e.target.value
                                                    }
                                                    placeholder="Enter your Right Name"
                                                    required
                                                />
                                                <div style={{ fontSize: 12, color: "red" }}>
                                                    {this.state.userrighterror}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12">
                                            <FormGroup>
                                                <Label htmlFor="displayname">Display_Name:</Label>
                                                <Input
                                                    type="text"
                                                    id="displayname"
                                                    name="displayname"
                                                    className="form-control"
                                                    defaultValue={this.state.displayname}
                                                    onChange={(e) =>
                                                        this.state.displayname = e.target.value
                                                    }
                                                    placeholder="Enter your Display Name"
                                                    required
                                                />
                                                <div style={{ fontSize: 12, color: "red" }}>
                                                    {this.state.displaynameerror}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12">
                                            <FormGroup>
                                                <Label htmlFor="group_name">Group_Name:</Label>
                                                <Input
                                                    type="text"
                                                    id="group_name"
                                                    name="group_name"
                                                    className="form-control"
                                                    defaultValue={this.state.group_name}
                                                    onChange={(e) =>
                                                        this.state.group_name = e.target.value
                                                    }
                                                    placeholder="Enter your Group Name"
                                                    required
                                                />
                                                <div style={{ fontSize: 12, color: "red" }}>
                                                    {this.state.group_nameerror}
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12">
                                            <FormGroup>
                                                <Label htmlFor="group_display_name">Group_Display_Name:</Label>
                                                <Input
                                                    type="text"
                                                    id="group_display_name"
                                                    name="group_display_name"
                                                    className="form-control"
                                                    defaultValue={this.state.group_display_name}
                                                    onChange={(e) =>
                                                        this.state.group_display_name = e.target.value
                                                    }
                                                    placeholder="Enter your Group Display Name"
                                                    required
                                                />
                                                <div style={{ fontSize: 12, color: "red" }}>
                                                    {this.state.group_display_nameerrror}
                                                </div>

                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    {error ?
                                        (<Alert color="danger">
                                            {error}
                                        </Alert>) : (<div />)
                                    }
                                    {
                                        this.state.updateRightBtn == false ? (
                                            <Button type="button" size="sm" color="primary" onClick={this.userRightData} disabled={fetching} style={{ marginTop: '15px' }}>Save</Button>
                                        ) : (
                                                <Button type="button" size="sm" color="primary" onClick={this.UpdateUserRightData} disabled={fetching} style={{ marginTop: '15px' }}>Update</Button>
                                            )
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="12" sm="12" md="12" lg="8" xl="8">
                            <Card>
                                <CardHeader>
                                    <strong>UserRight</strong>
                                </CardHeader>
                                <CardBody>
                                    <div>
                                        {
                                            this.state.isDisplay == true ? (
                                                <Row>
                                                    <Col xs="2">
                                                        <div>
                                                        {(checkRights('user_right', 'delete') == true)? (
                                                                     <Button
                                                                     type="button"
                                                                     size="md"
                                                                     color="danger"
                                                                     onClick={this.deleteAllUserRightData}
                                                                     disabled={!this.state.delete}
                                                                 >
                                                                     Delete
                                                          </Button>
                                                                ) : (null)}
                                                        </div>
                                                    </Col>
                                                    <Col xs="7">
                                                        <div className="search">
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                placeholder="Search"
                                                                aria-label="Search"
                                                                onKeyUp={this.searchUserRightDataKeyUp}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col xs="3">
                                                        <Row>
                                                            <Col xs="4">
                                                                {/* <span className="size">page</span> */}
                                                            </Col>
                                                            <Col xs="8">
                                                                <Input
                                                                    type="select"
                                                                    id="exampleCustomSelect"
                                                                    name="customSelect"
                                                                    onChange={this.handleChangeEvent}
                                                                >
                                                                    <option value="5">5</option>
                                                                    <option value="10">10</option>
                                                                </Input>
                                                            </Col>
                                                        </Row>

                                                    </Col>
                                                </Row>
                                            ) : (
                                                    null
                                                )
                                        }
                                    </div>
                                    <br />
                                    <TableRight auth={auth} rightCountData={rightCountData} RightPGData={RightPGData} deleteRightData={deleteRightData} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                ) : (null)}
            </div>
        );
    }
}

export default UserRight;
