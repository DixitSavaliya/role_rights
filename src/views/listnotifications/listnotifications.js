import React, { Fragment } from 'react';
import Swal from 'sweetalert2';
import TableNotifications from '../Tables/tablenotifications';
import { EventEmitter } from '../../event';
import { Link } from 'react-router-dom';
import './listnotifications.css';
import checkRights from '../../rights';
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

class ListNotifications extends React.Component {

    /** First Constructor Call */
    constructor(props) {
        super(props);
        this.state = {
            application: [],
            searchData: '',
            ownership: '',
            isDisplay: false,
            deletedata: '',
            delete: false,
            auth: JSON.parse(window.sessionStorage.getItem('ad_network_auth')),
            check: false,
            isData: false,
            searchData: '',
            count: '',
            currentPage: "1",
            items_per_page: "5",
            render_per_page: "5",
            perpage: '',
            paginationdata: '',
            isFetch: false,
            data: '',
            allRecords: '',
            upperPageBound: "3",
            lowerPageBound: "0",
            pageBound: "3",
            isPrevBtnActive: 'disabled',
            isNextBtnActive: '',
            onClickPage: "1",
            ownership: '',
            ads: false,
            _maincheck: false,
            rightdata:'',
            flag:1
        }

        this.handleChangeEvent = this.handleChangeEvent.bind(this);
        this.deleteNotificationData = this.deleteNotificationData.bind(this);

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

        EventEmitter.subscribe('deletenotificationpagedata', (data) => {
            this.setState({
                deletedata: this.state.deletedata = data,
                delete: this.state.delete = true
            })
        });
        this.getNotificationsCount();
    }

    getNotificationsCount() {
        const obj = {
            user_id: this.props.auth.auth_data.id
        }
        let _this = this;
        this.props.notificationCount(obj).then((res) => {

            _this.setState({
                count: _this.state.count = res.response.data
            })
            _this.getNotificationPageData();
        })

    }

    getNotificationPageData() {
        const obj = {
            page_no: "1",
            items_per_page: this.state.items_per_page,
            user_id: this.props.auth.auth_data.id
        }
        let _this = this;
        this.props.notificationPGData(obj).then(function (res) {
            _this.setState({
                paginationdata: res.response.data,
                isFetch: true
            })
        })
    }


    handleChangeEvent(e) {
        EventEmitter.dispatch('per_page_notification_value', e.target.value);
    }


    deleteNotificationData() {
        const remove = {
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
                this.props.deleteNotificationData(remove).then((res) => {
                    if (res.response.status == 1) {
                        Swal.fire({
                            text: res.response.message,
                            icon: 'success'
                        });
                        EventEmitter.dispatch('send_notification', 1);
                        this.setState({
                            delete: this.state.delete = false
                        })
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

    render() {
        const { auth, notificationCount, notificationPGData } = this.props;
        return (
            <div>
                {(checkRights('notification', 'read') == true) ? (
                    <Row>
                        <Col xs="12" sm="12" md="12" lg="12" xl="12">
                            <Card className="main-card mb-3">
                                <CardHeader>
                                    <CardTitle
                                        className="font"
                                    >
                                        Notifications
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <div>
                                        <Row>
                                            <Col md="4">
                                                <Row>
                                                    <Col md="4">
                                                        <Row>
                                                            <Col md="6">
                                                                {(checkRights('notification', 'write') == true) ? (
                                                                    <div className="rightapp">
                                                                        <Link to="/notifications">
                                                                            <Button
                                                                                className="mb-2 mr-2"
                                                                                color="primary"
                                                                            >
                                                                                Add
                                                                                                                  </Button>
                                                                        </Link>
                                                                    </div>
                                                                ) : (null)}
                                                            </Col>
                                                            <Col md="6">
                                                                {(checkRights('notification', 'write') == true) && (checkRights('notification', 'delete') == true) ? (
                                                                    <div className="rightapp">
                                                                        <Button
                                                                            className="mb-2 mr-2"
                                                                            color="danger"
                                                                            onClick={this.deleteNotificationData}
                                                                            disabled={!this.state.delete}
                                                                        >
                                                                            Delete
                                                                                                           </Button>

                                                                    </div>
                                                                ) : (null)}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md="8">
                                                <div className="pull-right">
                                                    <Row>
                                                        <span style={{ marginTop: '8px' }}>Records per page</span>
                                                        <Col md="2">
                                                            <Input
                                                                type="select"
                                                                id="rightid"
                                                                name="customSelect"
                                                                onChange={this.handleChangeEvent}
                                                            >
                                                                <option value="5">5</option>
                                                                <option value="10">10</option>
                                                            </Input>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <br />
                                    <TableNotifications {...this.props} auth={auth} notificationCount={notificationCount} notificationPGData={notificationPGData} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                ) : (null)}
            </div>
        );
    }
}

export default ListNotifications;