import React, { Component } from 'react';
import Swal from 'sweetalert2';
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
    InputGroupButton
} from 'reactstrap';

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            old_password: '',
            new_password: ''
        }
        this.ChangePassword = this.ChangePassword.bind(this);
    }

    ChangePassword() {
        const data = {
            old_password: this.state.old_password,
            new_password: this.state.new_password,
            username:this.props.auth.auth_data ? this.props.auth.auth_data.user_email || this.props.auth.auth_data.username : '',
            id:this.props.auth.auth_data.id
        }
        this.props.changepassword(data).then((res) => {
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
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <strong>Change Password</strong>
                             
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xs="6">
                                        <FormGroup>
                                            <Label htmlFor="old_password">OldPassword</Label>
                                            <Input
                                                type="password"
                                                id="old_password"
                                                name="old_password"
                                                className="form-control"
                                                onChange={(e) =>
                                                    this.state.old_password = e.target.value
                                                }
                                                placeholder="Enter your Old Password"
                                                required
                                            />

                                        </FormGroup>
                                    </Col>
                                    <Col xs="6">
                                        <FormGroup>
                                            <Label htmlFor="new_password">NewPassword</Label>
                                            <Input
                                                type="password"
                                                id="new_password"
                                                name="new_password"
                                                className="form-control"
                                                onChange={(e) =>
                                                    this.state.new_password = e.target.value
                                                }
                                                placeholder="Enter your New Password"
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                {error ?
                                    (<Alert color="danger">
                                        {error}
                                    </Alert>) : (<div />)
                                }
                                <Button type="button" size="sm" color="primary" onClick={this.ChangePassword} disabled={fetching}>Update</Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ChangePassword;
