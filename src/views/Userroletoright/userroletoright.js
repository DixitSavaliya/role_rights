import React, { Fragment } from 'react';
import { Button } from 'reactstrap';
import Swal from 'sweetalert2';
import { EventEmitter } from '../../event';
import {
    Row, Col,
    Card, CardBody,
    CardTitle,
    CardHeader,
    Input,
    CustomInput, Form, FormGroup, Label, Table
} from 'reactstrap';
import Socket from '../../socket';
import Auth from '../../redux/Auth';
import { REMOTE_URL } from '../../redux/constants/index';
import axios from 'axios';

class UserRoleToRight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userrole: [],
            userright: [],
            userroletorightdata: [],
            user_role_id: '',
            selectroledata: '',
            _maincheck: false,
            noData: false,
            auth: JSON.parse(window.sessionStorage.getItem('ad_network_auth'))
        }
        this.handleMainChange = this.handleMainChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.editUserRoleToRight = this.editUserRoleToRight.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
    }

    componentDidMount() {
        if(this.props.auth) {
            this.getUserRole();
            this.getUserRight();
        }
    }

    getUserRole() {
        const obj = {
            userRole_id: this.state.auth.user_role_id,
            user_type: this.state.auth.type
        }
        let _this = this;
        this.props.getUserRoleData(obj).then(function (res) {
            _this.setState({
                userrole: _this.state.userrole = res.response.data
            })
        });
    }

    getUserRight() {
        let _this = this;
        this.props.getUserRightData().then(function (res) {
            _this.setState({
                userright: _this.state.userright = res.response.data
            })
        });

    }

    checkMaster(data) {
        let count = 0;
        data.forEach(element => {
            if (element.read == true && element.write == true && element.delete == true && element.import == true && element.export == true) {
             
                element._rowChecked = true;
                count++;
            } else {
                
                element._rowChecked = false;
            }
        });
        if (count == data.length) {
            this.setState({
                _maincheck: true
            })
        } else {
            this.setState({
                _maincheck: false
            })
        }
        this.setState({
            selectroledata: data
        });
    }

    onItemSelect(event) {
        let _id = event.target.options[event.target.selectedIndex].value;
        let _name = event.target.options[event.target.selectedIndex].innerHTML;
        this.setState({
            user_role_id: this.state.user_role_id = _id
        })
        this.setState({
            selectroledata: []
        })
        if (this.state.user_role_id) {
            this.setState({
                noData: this.state.noData = false
            })
            const obj = {
                userRole: this.state.user_role_id
            }
            let _this = this;
         
            axios.defaults.headers.post['Authorization'] = 'Barier ' + (this.props.auth.auth_data ? this.props.auth.auth_data.access_token : '');
            axios.defaults.headers.post['content-md5'] = this.props.auth.auth_data ? this.props.auth.auth_data.secret_key : '';
         
            // const obj = {
            //     userRole: this.props.auth.user.user_role_id
            // }
            axios.post(REMOTE_URL + "UserRole/getUserRoleToRight", obj)
                .then(response => {
                    let data = response.data.data;
    
                    let newData = [];
                    for (let i = 0; i < _this.state.userright.length; i++) {
                        let right = _this.state.userright[i];
                        let ind = data.findIndex((x) => x.id == right.id);
                        if (ind > -1) {
                            right['read'] = data[ind].read ? true : false;
                            right['write'] = data[ind].write ? true : false;
                            right['delete'] = data[ind].delete ? true : false;
                            right['import'] = data[ind].import ? true : false;
                            right['export'] = data[ind].export ? true : false;
                            right['role_id'] = data[0].role_id;
                            right['role_name'] = data[0].role_name;
                        } else {
                            right['read'] = false;
                            right['write'] = false;
                            right['delete'] = false;
                            right['import'] = false;
                            right['export'] = false;
                            right['role_id'] = data[0] ? data[0].role_id : _id;
                            right['role_name'] = data[0] ? data[0].role_name : _name;
                        }
                        newData.push(right);
                    }
                    let count = 0;
                    newData.forEach(element => {
                        if (element.read == true && element.write == true && element.delete == true && element.import == true && element.export == true) {
                            element._rowChecked = true;
                            count++;
                        } else {
                            element._rowChecked = false;
                        }
                    });
                    _this.setState({
                        selectroledata: newData
                    })
                    if (count == newData.length) {
                        _this.setState({
                            _maincheck: true
                        })
                    } else {
                        _this.setState({
                            _maincheck: false
                        })
                    }
                    
                    // window.sessionStorage.setItem('ad_network_auth_right', JSON.stringify(response.data.data));
                }).catch(error => {
                    console.log("error", error);
                });


            // this.props.userroletoright(obj).then(function (res) {
            //     let data = res.response.data;
    
            //     let newData = [];
            //     for (let i = 0; i < _this.state.userright.length; i++) {
            //         let right = _this.state.userright[i];
            //         let ind = data.findIndex((x) => x.id == right.id);
            //         if (ind > -1) {
            //             right['read'] = data[ind].read ? true : false;
            //             right['write'] = data[ind].write ? true : false;
            //             right['delete'] = data[ind].delete ? true : false;
            //             right['import'] = data[ind].import ? true : false;
            //             right['export'] = data[ind].export ? true : false;
            //             right['role_id'] = data[0].role_id;
            //             right['role_name'] = data[0].role_name;
            //         } else {
            //             right['read'] = false;
            //             right['write'] = false;
            //             right['delete'] = false;
            //             right['import'] = false;
            //             right['export'] = false;
            //             right['role_id'] = data[0] ? data[0].role_id : _id;
            //             right['role_name'] = data[0] ? data[0].role_name : _name;
            //         }
            //         newData.push(right);
            //     }
            //     let count = 0;
            //     newData.forEach(element => {
            //         if (element.read == true && element.write == true && element.delete == true && element.import == true && element.export == true) {
            //             element._rowChecked = true;
            //             count++;
            //         } else {
            //             element._rowChecked = false;
            //         }
            //     });
            //     _this.setState({
            //         selectroledata: newData
            //     })
            //     if (count == newData.length) {
            //         _this.setState({
            //             _maincheck: true
            //         })
            //     } else {
            //         _this.setState({
            //             _maincheck: false
            //         })
            //     }
            // })
        } else {
            this.setState({
                noData: this.state.noData = true
            })
        }
    }

    handleMainChange(e) {
        let _val = e.target.checked;
        this.state.selectroledata.forEach(element => {
            element._rowChecked = _val
            element.read = (_val == true ? true : false)
            element.write = (_val == true ? true : false)
            element.delete = (_val == true ? true : false)
            element.import = (_val == true ? true : false)
            element.export = (_val == true ? true : false)
        });
        this.setState({
            selectroledata: this.state.selectroledata
        })
        this.setState({
            _maincheck: _val
        })
    }

    handleChange(item, type, e) {
        let _id = item.id;
        let _type = type;
        let ind = this.state.selectroledata.findIndex((x) => x.id == _id);
        let data = this.state.selectroledata;
        if (ind > -1) {
            if (_type != 'read' && _type != 'write' && _type != 'delete' && _type != 'import' && _type != 'export') {
                let newState = !item._rowChecked;
                data[ind]._rowChecked = newState;
                if (!newState) {
                    data[ind].read = false;
                    data[ind].write = false;
                    data[ind].delete = false;
                    data[ind].import = false;
                    data[ind].export = false;
                } else {
                    data[ind].read = true;
                    data[ind].write = true;
                    data[ind].delete = true;
                    data[ind].import = true;
                    data[ind].export = true;
                }
            } else {
                let newState = !item[_type]
                data[ind][_type] = newState
            }
            this.setState({
                selectroledata: data
            });
        }
        this.checkMaster(data);
    }

    // userroleright() {
    //     const obj = {
    //         userRole: this.props.auth.user.user_role_id
    //       }
    //     this.props.userroletoright(obj).then(function (res) {
    //         let data = res.response.data;
    //         Auth.setRight(data);
    //         // window.sessionStorage.setItem('ad_network_auth_right', JSON.stringify(data));
    //         EventEmitter.dispatch('TRUE',res.response.data);
    //     })
    // }

    editUserRoleToRight() {
        let data = this.state.selectroledata.map((x) => {
            if(x.read) {
                x.read = 1
            } else {
                x.read = 0
            }
            if(x.write) {
                x.write = 1
            } else {
                x.write = 0
            }
            if(x.delete) {
                x.delete = 1
            } else {
                x.delete = 0
            }
            if(x.import) {
                x.import = 1
            } else {
                x.import = 0
            }
            if(x.export) {
                x.export = 1
            } else {
                x.export = 0
            }
            return x;
        })
        const obj = {
            userRole: this.state.user_role_id,
            right: data
        }
        this.props.edituserroletoright(obj).then((res) => {
            if (res.response.status == 1) {
                EventEmitter.dispatch('right_updated');
                  Swal.fire({
                    text: res.response.message,
                    icon: 'success'
                });
                this.props.setUserRights(data);
                // this.userroleright();SETUSERRIGHTS
            } else {
                Swal.fire({
                    text: res.response.message,
                    icon: 'warning'
                });
            }
        }) 
   }

    render() {
        const { auth } = this.props;
        return (
            <div>
                <Row>
                    <Col md="4">
                        <Form>
                            <FormGroup>
                                <Label for="exampleCustomSelect"><b>Select Role To Manage The All Rights:</b></Label>
                                <Input
                                    type="select"
                                    id="exampleCustomSelect"
                                    name="customSelect"
                                    onChange={this.onItemSelect}
                                >
                                    <option value="">Select UserRole:</option>
                                    {
                                        this.state.userrole.length > 0 ? this.state.userrole.map((data, index) =>
                                            <option key={data.id} value={data.id}>{data.name}</option>
                                        ) : ''
                                    }
                                </Input>
                            </FormGroup>
                        </Form>
                        {
                            this.state.selectroledata && !this.state.noData ? (
                                <Button className="mb-2 mr-2" color="primary" onClick={this.editUserRoleToRight}>
                                    Assign Rights
                                             </Button>
                            ) : (
                                    null
                                )
                        }
                    </Col>

                    <Col md="8">
                        <Card className="main-card mb-3">
                            <CardHeader>
                                <CardTitle className="font">User Role To Right</CardTitle>
                            </CardHeader>
                            <CardBody>
                                {
                                    this.state.selectroledata && !this.state.noData ? (
                                        <Table hover className="mb-0" bordered>
                                            <thead>
                                                <tr>
                                                    <th className="centers">
                                                        <Input
                                                            name="name"
                                                            defaultValue="value"
                                                            type="checkbox"
                                                            id="exampleCustomCheckbox"
                                                            onChange={this.handleMainChange}
                                                            checked={this.state._maincheck}
                                                        />
                                                    </th>
                                                    <th>Right</th>
                                                    <th>Read</th>
                                                    <th>Write</th>
                                                    <th>Delete</th>
                                                    <th>Import</th>
                                                    <th>Export</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.selectroledata ? (
                                                        this.state.selectroledata.map((data, index) =>
                                                            <tr key={index} >
                                                                <td className="centers">
                                                                    <Input
                                                                        name={data.module}
                                                                        defaultValue={this.state.selectroledata[index]['_rowChecked'] == true ? 1 : 0}
                                                                        type="checkbox"
                                                                        id={data.id}
                                                                        onChange={(e) => this.handleChange(data, 'row', e)}
                                                                        checked={this.state.selectroledata[index]['_rowChecked'] == true}
                                                                    />
                                                                </td>
                                                                <td><span>{data.name}</span></td>
                                                                <td className="centers">
                                                                    <Input
                                                                        name="read"
                                                                        defaultValue={this.state.selectroledata[index]['read'] == true ? 1 : 0}
                                                                        type="checkbox"
                                                                        id={data.id + 'read'}
                                                                        data_type="read"
                                                                        onChange={(e) => this.handleChange(data, 'read', e)}
                                                                        checked={this.state.selectroledata[index]['read'] == true}
                                                                    />
                                                                </td>
                                                                <td className="centers">
                                                                    <Input
                                                                        name="write"
                                                                        defaultValue={this.state.selectroledata[index]['write'] == true ? 1 : 0}
                                                                        type="checkbox"
                                                                        id={data.id + 'write'}
                                                                        data_type="write"
                                                                        onChange={(e) => this.handleChange(data, 'write', e)}
                                                                        checked={this.state.selectroledata[index]['write'] == true}
                                                                    />
                                                                </td>
                                                                <td className="centers">
                                                                    <Input
                                                                        name="delete"
                                                                        defaultValue={this.state.selectroledata[index]['delete'] == true ? 1 : 0}
                                                                        type="checkbox"
                                                                        id={data.id + 'delete'}
                                                                        data_type="delete"
                                                                        onChange={(e) => this.handleChange(data, 'delete', e)}
                                                                        checked={this.state.selectroledata[index]['delete'] == true}
                                                                    />
                                                                </td>
                                                                <td className="centers">
                                                                    <Input
                                                                        name="import"
                                                                        defaultValue={this.state.selectroledata[index]['import'] == true ? 1 : 0}
                                                                        type="checkbox"
                                                                        id={data.id + 'import'}
                                                                        data_type="import"
                                                                        onChange={(e) => this.handleChange(data, 'import', e)}
                                                                        checked={this.state.selectroledata[index]['import'] == true}
                                                                    />
                                                                </td>
                                                                <td className="centers">
                                                                    <Input
                                                                        name="export"
                                                                        defaultValue={this.state.selectroledata[index]['export'] == true ? 1 : 0}
                                                                        type="checkbox"
                                                                        id={data.id + 'export'}
                                                                        data_type="export"
                                                                        onChange={(e) => this.handleChange(data, 'export', e)}
                                                                        checked={this.state.selectroledata[index]['export'] == true}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    ) : (
                                                            null
                                                        )
                                                }
                                            </tbody>
                                        </Table>
                                    ) : (
                                            null
                                        )
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>

        );
    }
}

export default UserRoleToRight;