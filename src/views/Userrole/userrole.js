import React, { Component } from 'react';
import './userrole.css';
import TableRole from '../Tables/tablerole';
import { EventEmitter } from '../../event';
import checkRights from '../../rights';
import Swal from 'sweetalert2';
import Auth from '../../redux/Auth';
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

class UserRole extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            statuscheck1: true,
            userrole: '',
            userroleerror: '',
            status: 1,
            statuserror: '',
            isDeleted: false,
            modal: false,
            emit: false,
            user: [],
            roleId: '',
            searchData: '',
            delete: false,
            updateRoleBtn: false,
            deletedata: '',
            isDisplay: false,
            flag:1,
            rightdata:''
        }
        this.userRoleData = this.userRoleData.bind(this);
        this.UpdateUserRoleData = this.UpdateUserRoleData.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.searchUserRoleDataKeyUp = this.searchUserRoleDataKeyUp.bind(this);
        this.handleChangeEvent = this.handleChangeEvent.bind(this);
        this.deleteAllUserRoleData = this.deleteAllUserRoleData.bind(this);
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

        EventEmitter.subscribe('roleIsDisplay', (value) => {
            this.setState({ isDisplay: this.state.isDisplay = true });
        });


        EventEmitter.subscribe('deletepagedata', (data) => {
            this.setState({
                deletedata: this.state.deletedata = data,
                delete: this.state.delete = true
            })
        });

        EventEmitter.subscribe('editData', (data) => {
            this.setState({
                updateRoleBtn: this.state.updateRoleBtn = true,
                roleId: this.state.roleId = data.id
            })
            this.setState({
                userrole: this.state.userrole = data.name,
                status: this.state.status = 1,
                statuscheck1: this.state.statuscheck1 = (data.status == 1) ? true : false
            })
        });
    }

    validate() {
        let userroleerror = "";
        let statuserror = "";

        if (!this.state.userrole) {
            userroleerror = "please enter userrole";
        }

        if (!this.state.status) {
            statuserror = "please enter status";
        }

        if (userroleerror || statuserror) {
            this.setState({ userroleerror, statuserror });
            return false;
        }
        return true;
    };

    userRoleData() {
        const isValid = this.validate();
        if (isValid) {
            this.setState({

                userroleerror: this.state.userroleerror = '',

                statuserror: this.state.statuserror = '',
                statuscheck1: this.state.statuscheck1 = true
            })
            if (this.state.userrole && this.state.status) {
                const data = {
                    name: this.state.userrole,
                    status: this.state.status
                }
                this.props.addUserRole(data).then((res) => {
                    if (res.response.status == 1) {
                        Swal.fire({
                            text: res.response.message,
                            icon: 'success'
                        });
                        EventEmitter.dispatch('role_added', 1);
                    } else {
                        Swal.fire({
                            text: res.response.message,
                            icon: 'warning'
                        });
                    }
                });
            } else {
                Swal.fire("PLease Enter Field First!", "", "warning");
            }
        };
    }

    handleChangeStatus(event) {
        this.setState({
            statuscheck1: this.state.statuscheck1 = event.target.checked,
            status: this.state.status = event.target.defaultValue
        })
    }

    UpdateUserRoleData() {
        const isValid = this.validate();
        if (isValid) {
            this.setState({

                userroleerror: this.state.userroleerror = '',

                statuserror: this.state.statuserror = '',
                statuscheck1: this.state.statuscheck1 = true
            })
            if (this.state.userrole && this.state.status) {
                this.setState({
                    checked: false
                })
                const obj = {
                    name: this.state.userrole,
                    status: this.state.status = this.state.status,
                    id: this.state.roleId
                }
                this.props.updateRole(obj).then((res) => {
                    if (res.response.status == 1) {
                        Swal.fire({
                            text: res.response.message,
                            icon: 'success'
                        });
                        EventEmitter.dispatch('role_updated', 1);
                        this.setState({
                            updateRoleBtn: this.state.updateRoleBtn = false
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

    deleteAllUserRoleData() {
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
                this.props.deleteRoleData(role).then((res) => {
                    if (res.response.status == 1) {
                        Swal.fire({
                            text: res.response.message,
                            icon: 'success'
                        });
                        setTimeout(() => {
                            this.userRoleData();
                        }, 1200)
                    } else {
                        Swal.fire({
                            text: res.response.message,
                            icon: 'warning'
                        });
                    }
                });

            }
        })
    }

    searchUserRoleDataKeyUp(e) {
        const obj = {
            search_string: e.target.value
        }
        this.props.searchRole(obj);
        EventEmitter.dispatch('searchData', this.state.searchData);
    }

    render() {
        const { auth, roleCountData, RolePGData, deleteRoleData } = this.props;

        this.state.searchData = this.props.auth.searchdata;
        // EventEmitter.dispatch('searchData', this.state.searchData);
        const { fetching, error } = auth;

        return (
            <div className="animated fadeIn">
                {(checkRights('user_role','read') == true) ? (
                    <Row>
                        <Col xs="12" sm="12" md="12" lg="6" xl="6">
                            <Card>
                                <CardHeader>
                                    <strong>UserRole</strong>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col xs="12">
                                            <FormGroup>
                                                <Label htmlFor="userrole">Role_Name:</Label>
                                                <Input
                                                    type="text"
                                                    id="userrole"
                                                    name="userrole"
                                                    className="form-control"
                                                    defaultValue={this.state.userrole}
                                                    onChange={(e) =>
                                                        this.state.userrole = e.target.value
                                                    }
                                                    placeholder="Enter your Role Name"
                                                    required
                                                />
                                            </FormGroup>
                                            <div style={{ fontSize: 12, color: "red" }}>
                                                {this.state.userroleerror}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="6">
                                            <Label>Status:</Label>
                                            <br />
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
                                                    Active
                                                                                            </Label>
                                            </FormGroup>
                                            <FormGroup check inline>
                                                <Input

                                                    type="radio"
                                                    id="inline-radio2"
                                                    defaultValue="0"
                                                    checked={this.state.status == 0 ? this.state.statuscheck1 : !this.state.statuscheck1}
                                                    name="status"
                                                    onChange={this.handleChangeStatus}
                                                />

                                                <Label
                                                    className="form-check-label"
                                                    check htmlFor="inline-radio2"
                                                >
                                                    InActive
                                                                                            </Label>

                                            </FormGroup>
                                            <div style={{ fontSize: 12, color: "red" }}>
                                                {this.state.statuserror}
                                            </div>
                                        </Col>
                                    </Row>
                                    {error ?
                                        (<Alert color="danger">
                                            {error}
                                        </Alert>) : (<div />)
                                    }
                                    {
                                        this.state.updateRoleBtn == false ? (
                                            <Button type="button" size="sm" color="primary" onClick={this.userRoleData} disabled={fetching} style={{ marginTop: '15px' }}>Save</Button>
                                        ) : (
                                                <Button type="button" size="sm" color="primary" onClick={this.UpdateUserRoleData} disabled={fetching} style={{ marginTop: '15px' }}>Update</Button>
                                            )
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="12" sm="12" md="12" lg="6" xl="6">
                            <Card>
                                <CardHeader>
                                    <strong>UserRole</strong>
                                </CardHeader>
                                <CardBody>
                                    <div>
                                        {
                                            this.state.isDisplay == true ? (
                                                <Row>
                                                    <Col xs="4">
                                                        {(checkRights('user_role','delete') == true) ? (
                                                            <Button
                                                                type="button"
                                                                size="md"
                                                                color="danger"
                                                                onClick={this.deleteAllUserRoleData}
                                                                disabled={!this.state.delete}
                                                            >
                                                                Delete
                                                            </Button>
                                                        ) : (null)}
                                                    </Col>
                                                    <Col xs="8">
                                                        <Row>
                                                            <Col xs="8">
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    placeholder="Search"
                                                                    aria-label="Search"
                                                                    onKeyUp={this.searchUserRoleDataKeyUp}
                                                                />
                                                            </Col>
                                                            <Col xs="4">
                                                                <div className="left">
                                                                    <Input
                                                                        type="select"
                                                                        id="exampleCustomSelect"
                                                                        name="customSelect"
                                                                        onChange={this.handleChangeEvent}
                                                                    >
                                                                        <option value="5">5</option>
                                                                        <option value="10">10</option>
                                                                    </Input>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        {/* <div className="search">
                                                   
                                                   
                                                                                               </div> */}
                                                        {/* <div className="left">
                                                                                                  
                                                                                                  
                                                                                               </div> */}
                                                    </Col>
                                                    {/* <Col xs="3">
                                                                                               
                                                                                           </Col> */}
                                                </Row>
                                            ) : (
                                                    null
                                                )
                                        }
                                    </div>
                                    <br />
                                    <TableRole auth={auth} roleCountData={roleCountData} RolePGData={RolePGData} deleteRoleData={deleteRoleData} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                ) : (null)}
            </div>
        );
    }
}

export default UserRole;
