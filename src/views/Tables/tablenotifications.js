import React from 'react';
import { Table, Input, Button } from 'reactstrap';
import Switch from "react-switch";
import './table.css';
import API from '../../service';
import Swal from 'sweetalert2';
import { REMOTE_URL } from '../../redux/constants/index';
import { EventEmitter } from '../../event';
import checkRights from '../../rights';
import history from '../../history';
// import './table.css';
import { HashRouter, Link, Route } from "react-router-dom";

export default class TableNotifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            delete: ''
        }

        this.deleteNotificationData = this.deleteNotificationData.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.btnDecrementClick = this.btnDecrementClick.bind(this);
        this.btnIncrementClick = this.btnIncrementClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkAllHandler = this.checkAllHandler.bind(this);
        this.appData = this.appData.bind(this);
        // EventEmitter.subscribe('searchDataApp', (data) => {
        //     this.setState({
        //         searchData: data,
        //         isData: this.state.isData = true
        //     })
        // });
    }

    componentDidMount() {
        EventEmitter.subscribe('per_page_notification_value', (value) => {
            this.setState({ items_per_page: value });
            this.getNotificationsCount();
            setTimeout(() => {
                this.getNotificationPageData();
            }, 120)
        });

        EventEmitter.subscribe('select_app', (value) => {
            this.setState({ ownership: this.state.ownership = value });
            this.getNotificationsCount();
        });

        EventEmitter.subscribe('send_notification', (value) => {
            this.setState({
                _maincheck: this.state._maincheck = false
            })
            this.getNotificationsCount();
            setTimeout(() => {
                this.getNotificationPageData();
            }, 120)
        });
        this.getNotificationsCount();
    }

    getNotificationsCount() {
        const obj = {
            user_id: this.props.auth.user.user_group_id
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
            user_id: this.props.auth.user.user_group_id
        }
        let _this = this;
        this.props.notificationPGData(obj).then(function (res) {

            _this.setState({
                paginationdata: res.response.data,
                isFetch: true
            })
            EventEmitter.dispatch('isDisplay', 1);
        })
    }

    // editAppData(id) {
    //     this.props.history.push("/editapp/" + id)
    // }

    deleteNotificationData(data) {
        const obj = {
            notificationID: data
        }
        var array = [];
        array.push(obj);
        const data1 = {
            data: array
        }
        Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to cancel?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value) {
                this.props.deleteNotificationData(data1).then((res) => {
                    if (res.response.status == 1) {
                        Swal.fire({
                            text: res.response.message,
                            icon: 'success'
                        });
                        this.getNotificationPageData();
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

    handleClick(event) {
        if (this.state.currentPage <= '' + event.target.id) {
            this.setState({
                currentPage: this.state.currentPage + 1
                // render_per_page:
            })
        } else {
            this.setState({
                currentPage: this.state.currentPage - 1
            })
        }
        const obj = {
            page_no: '' + event.target.id,
            items_per_page: this.state.items_per_page,
            user_id: this.props.auth.user.user_group_id
        }
        let _this = this;
        this.props.notificationPGData(obj).then(function (res) {
            _this.setState({
                paginationdata: res.response.data,
                isFetch: true
            })
        })
    }

    appData(data) {
        const id = data.id;
        this.props.history.push("/view-notification/" + id)
    }

    checkAllHandler(event) {

        if (event.target.checked == true) {

            this.setState({
                _maincheck: this.state._maincheck = true,
                check: this.state.check = true,
                paginationdata: this.state.paginationdata = this.state.paginationdata.map(el => ({ ...el, _rowChecked: true }))
            })
            this.checkMaster(this.state.paginationdata);
        } else {

            this.setState({
                _maincheck: this.state._maincheck = false,
                check: this.state.check = false,
                paginationdata: this.state.paginationdata = this.state.paginationdata.map(el => ({ ...el, _rowChecked: false }))
            })
            this.checkMaster(this.state.paginationdata);
        }
    }

    checkMaster(data) {
        let count = 0;
        data.forEach(element => {
            if (element._rowChecked == true) {
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
            paginationdata: data
        });
        var array = [];
        for (var i = 0; i < this.state.paginationdata.length; i++) {
            if (this.state.paginationdata[i]._rowChecked == true) {
                array.push({ notificationID: this.state.paginationdata[i].id });
            }
        }
        EventEmitter.dispatch('deletenotificationpagedata', array);
    }

    handleChange(item, e) {
        let _id = item.id;
        let ind = this.state.paginationdata.findIndex((x) => x.id == _id);
        let data = this.state.paginationdata;
        if (ind > -1) {
            let newState = !item._rowChecked;
            data[ind]._rowChecked = newState;
            if (!newState) {
                data[ind]._rowChecked = false;

            } else {
                data[ind]._rowChecked = true;
            }

            this.setState({
                paginationdata: data
            });
        }
        this.checkMaster(data);
    }


    btnIncrementClick() {
        this.setState({ upperPageBound: this.state.upperPageBound + this.state.pageBound });
        this.setState({ lowerPageBound: this.state.lowerPageBound + this.state.pageBound });
        let listid = this.state.upperPageBound + 1;
        this.setState({ currentPage: listid });
    }

    btnDecrementClick() {
        this.setState({ upperPageBound: this.state.upperPageBound - this.state.pageBound });
        this.setState({ lowerPageBound: this.state.lowerPageBound - this.state.pageBound });
        let listid = this.state.upperPageBound - this.state.pageBound;
        this.setState({ currentPage: listid });
    }

    render() {
        let auth = this.props.auth.auth_data;
        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(this.state.count / this.state.items_per_page); i++) {
            pageNumbers.push(i);
        }
        var renderPageNumbers = pageNumbers.map(number => {
            if (number === 1 && this.state.currentPage === 1) {
                return (
                    <li
                        key={number}
                        id={number}
                        className={this.state.currentPage === number ? 'active' : 'page-item'}
                    >
                        <a className="page-link" onClick={this.handleClick}>{number}</a>
                    </li>
                );
            }
            else if ((number < this.state.upperPageBound + 1) && number > this.state.lowerPageBound) {
                return (
                    <li
                        key={number}
                        id={number}
                        className={this.state.currentPage === number ? 'active' : 'page-item'}
                    >
                        <a className="page-link" id={number} onClick={this.handleClick}>{number}</a>
                    </li>
                )
            }
        });

        let pageIncrementBtn = null;
        if (pageNumbers.length > this.state.upperPageBound) {
            pageIncrementBtn =
                <li
                    className='page-item'
                >
                    <a
                        className='page-link'
                        onClick={this.btnIncrementClick}
                    >
                        &hellip;
          </a>
                </li>
        }

        let pageDecrementBtn = null;
        if (this.state.lowerPageBound >= 1) {
            pageDecrementBtn =
                <li
                    className='page-item'
                >
                    <a
                        className='page-link'
                        onClick={this.btnDecrementClick}
                    >
                        &hellip;
          </a>
                </li>
        }

        return (
            <div>
                {(checkRights('notification', 'read') == true) ? (
                    <div>
                        {
                            this.state.paginationdata ? (
                                <div>
                                    <Table hover className="mb-0" bordered>
                                        <thead>
                                            <tr>
                                                {(checkRights('notification', 'write') == true) && (checkRights('notification', 'delete') == true) ? (
                                                    <th className="center">
                                                        <Input
                                                            type="checkbox"
                                                            id="exampleCustomCheckbox"
                                                            onChange={this.checkAllHandler}
                                                            checked={this.state._maincheck}
                                                        />
                                                    </th>
                                                ) : (null)}
                                                {(checkRights('notification', 'write') == true) && (checkRights('notification', 'delete') == true) ? (
                                                    <th className="action">Action</th>
                                                ) : (null)}
                                                <th>Icon</th>
                                                <th>Title</th>
                                                <th>Message</th>
                                                <th>Type</th>
                                                <th>True_Count</th>
                                                <th>False_Count</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.paginationdata.map((data, index) =>
                                                    <tr key={index}>
                                                        {(checkRights('notification', 'write') == true) && (checkRights('notification', 'delete') == true) ? (
                                                            <th scope="row" className="center">
                                                                <span className="margin-t">
                                                                    <Input
                                                                        type="checkbox"
                                                                        id={index}
                                                                        checked={data._rowChecked == true ? true : false}
                                                                        onChange={(e) => this.handleChange(data, e)}
                                                                    />
                                                                </span>
                                                            </th>
                                                        ) : (null)}
                                                        {(checkRights('notification', 'write') == true) && (checkRights('notification', 'delete') == true) ? (
                                                            <td className="action">
                                                                <span className="padding">
                                                                    {
                                                                        (checkRights('notification', 'write') == true) && (checkRights('notification', 'delete') == true) ? (
                                                                            <i className="fa fa-remove fa-lg" onClick={() => this.deleteNotificationData(data.id)}></i>
                                                                        ) : (
                                                                                null
                                                                            )
                                                                    }
                                                                </span>
                                                            </td>
                                                        ) : (null)}
                                                        <td onClick={() => this.appData(data)}>
                                                            {
                                                                data.icon != null ? (
                                                                    <img src={REMOTE_URL + data.icon} className="img-nt" alt="admin@bootstrapmaster.com" />
                                                                ) : (
                                                                        <img src={require('./2.png')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                                                                    )
                                                            }
                                                        </td>
                                                        <td onClick={() => this.appData(data)} style={{ wordBreak: ' break-all' }}>{data.title}</td>
                                                        <td onClick={() => this.appData(data)} style={{ wordBreak: ' break-all' }}>{data.message}</td>
                                                        <td onClick={() => this.appData(data)}>{data.type == 1 ? 'Sheduled' : 'Immediate'}</td>
                                                        <td onClick={() => this.appData(data)}>
                                                            {data.true_count}
                                                        </td>
                                                        <td onClick={() => this.appData(data)}>
                                                            {data.false_count}
                                                        </td>
                                                        <td onClick={() => this.appData(data)}>
                                                            <div className="btn_size">
                                                                {
                                                                    data.run_state == 1 ? (
                                                                        <span className="badge badge-success">{data.run_state == "1" ? "Completed" : "Pending"}</span>
                                                                    ) : (
                                                                            <span className="badge badge-danger">{data.run_state == "1" ? "Completed" : "Pending"}</span>
                                                                        )
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </Table>
                                    {
                                        this.state.paginationdata ? (
                                            <div>
                                                <ul className="pagination" id="page-numbers">
                                                    {pageDecrementBtn}
                                                    {renderPageNumbers}
                                                    {pageIncrementBtn}
                                                </ul>
                                            </div>
                                        ) : (
                                                <Table hover className="mb-0" bordered>
                                                    <thead>
                                                        <tr>
                                                            <th className="action">Action</th>
                                                            <th>Icon</th>
                                                            <th>Title</th>
                                                            <th>Message</th>
                                                            <th>Type</th>
                                                            <th>True_Count</th>
                                                            <th>False_Count</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                    </tbody>
                                                </Table>
                                            )
                                    }
                                </div>
                            ) : (
                                    null
                                )
                        }
                    </div>
                ) : (null)
                }
            </div>
        );
    }
}
