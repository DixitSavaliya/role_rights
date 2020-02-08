import React from 'react';
import { Table, Input, Button } from 'reactstrap';
import './table.css';
// import API from '../../service';
import checkRights from '../../rights';
import Swal from 'sweetalert2';
import { EventEmitter } from '../../event';
import { HashRouter, Link, Route } from "react-router-dom";

export default class TableRole extends React.Component {
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
            perpage: "1",
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
            _maincheck: false
        }

        this.checkAllHandler = this.checkAllHandler.bind(this);
        // this.deleteUserRoleData = this.deleteUserRoleData.bind(this);
        this.editUserRoleData = this.editUserRoleData.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.btnDecrementClick = this.btnDecrementClick.bind(this);
        this.btnIncrementClick = this.btnIncrementClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        EventEmitter.subscribe('searchData', (data) => {

            this.setState({
                searchData: data,
                isData: true
            })

        });


        EventEmitter.subscribe('per_page_changed', (value) => {

            this.setState({ items_per_page: this.state.items_per_page = value });
            this.getRoleCountData();
            setTimeout(() => {
                this.getRolePageData();
            }, 120)
        });

        EventEmitter.subscribe('role_added', (data) => {
            this.getRoleCountData();
            setTimeout(() => {
                this.getRolePageData();
            }, 120)
        });

        EventEmitter.subscribe('role_updated', (data) => {
            this.getRoleCountData();
            setTimeout(() => {
                this.getRolePageData();
            }, 120)
        });

        this.getRoleCountData();
        setTimeout(() => {
            this.getRolePageData();
        }, 120)
    }

    getRoleCountData() {
        this.props.roleCountData();
    }


    getRolePageData() {
        const obj = {
            page_no: this.state.perpage,
            items_per_page: this.state.items_per_page
        }
        this.props.RolePGData(obj).then((res) => {
            this.setState({
                paginationdata: this.state.paginationdata = res.response.data
            })
            EventEmitter.dispatch('roleIsDisplay', 1);
        });

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

    editUserRoleData(data) {
        EventEmitter.dispatch('editData', data);
    }

    deleteUserRoleData(data) {
        const obj = {
            userRoleID: data.id
        }
        var array = [];
        array.push(obj);
        const role = {
            data: array
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
                this.props.deleteRoleData(role);
                setTimeout(() => {
                    this.getRolePageData();
                }, 1200)
            }
        })
    }

    handleClick(event) {


        // this.setState({
        //     perpage: +this.state.perpage + +this.state.items_per_page,
        //     items_per_page: +this.state.items_per_page + +this.state.items_per_page
        // })
        if (this.state.currentPage <= '' + event.target.id) {
            this.setState({
                currentPage: this.state.currentPage + 1
            })
        } else {
            this.setState({
                currentPage: this.state.currentPage - 1
            })
        }
        const obj = {
            page_no: '' + event.target.id,
            items_per_page: this.state.items_per_page
        }
        this.props.RolePGData(obj).then((res) => {
            this.setState({
                paginationdata: this.state.paginationdata = res.response.data
            })
        });

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
                array.push({ userRoleID: this.state.paginationdata[i].id });
            }
        }
        EventEmitter.dispatch('deletepagedata', array);
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
        const { auth, roleCountData, countData } = this.props;
        this.state.count = this.props.auth.count;


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
                {(checkRights('user_role', 'read') == true) ? (
                    <div>
                        {
                            this.state.isData == false ? (
                                <div>
                                    {
                                        this.state.paginationdata.length ? (
                                            <div>
                                                <Table hover className="mb-0" bordered>
                                                    <thead>
                                                        <tr>
                                                            {(checkRights('user_role', 'delete') == true) ? (
                                                                <th className="center">
                                                                    <Input
                                                                        type="checkbox"
                                                                        id="exampleCustomCheckbox"
                                                                        onChange={this.checkAllHandler}
                                                                        checked={this.state._maincheck}
                                                                    />
                                                                </th>
                                                            ) : (null)}
                                                            {(checkRights('user_role', 'delete') == true) || (checkRights('user_role', 'write') == true) ? (
                                                                <th className="action">Action</th>
                                                            ) : (null)}
                                                            <th>Name</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.state.paginationdata.map((data, index) =>
                                                                <tr key={index}>
                                                                    {(checkRights('user_role', 'delete') == true) ? (
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

                                                                    <td className="action">
                                                                        <span className="padding">
                                                                            {(checkRights('user_role', 'write') == true) ? (
                                                                                <i className="fa fa-pencil-square fa-lg" onClick={() => this.editUserRoleData(data)}></i>
                                                                            ) : (null)}
                                                                            {(checkRights('user_role', 'delete') == true) ? (
                                                                                <i className="fa fa-remove fa-lg" onClick={() => this.deleteUserRoleData(data)}></i>
                                                                            ) : (null)}
                                                                        </span>
                                                                    </td>
                                                                    <td style={{ wordBreak: ' break-all' }}>{data.name}</td>
                                                                    <td>
                                                                        <div className="btn_size">
                                                                            {
                                                                                data.status == 1 ? (
                                                                                    <span className="badge badge-success">{data.status == "1" ? "active" : "inactive"}</span>
                                                                                ) : (
                                                                                        <span className="badge badge-danger">{data.status == "1" ? "active" : "inactive"}</span>
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
                                                            null
                                                        )
                                                }
                                                {/* <div>
                                showing {this.state.perpage} to {this.state.items_per_page} of {this.state.count} entries
                                        </div> */}
                                            </div>
                                        ) : (
                                                null
                                            )
                                    }
                                </div>
                            ) : (
                                    <div>
                                        {
                                            this.state.searchData.length ? (
                                                <div>
                                                    <Table hover className="mb-0" bordered>
                                                        <thead>
                                                            <tr>
                                                                <th className="center">
                                                                    <Input
                                                                        type="checkbox"
                                                                        id="exampleCustomCheckbox"
                                                                        onChange={this.checkAllHandler}
                                                                        checked={this.state._maincheck}
                                                                    />
                                                                </th>
                                                                <th className="action">Action</th>
                                                                <th>Name</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                this.state.searchData.map((data, index) =>
                                                                    <tr key={index}>
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
                                                                        <td className="action">
                                                                            <span className="padding">
                                                                                <i className="fa fa-pencil-square fa-lg" onClick={() => this.editUserRoleData(data)}></i>
                                                                                <i className="fa fa-remove fa-lg" onClick={() => this.deleteUserRoleData(data)}></i>
                                                                            </span>
                                                                        </td>
                                                                        <td style={{ wordBreak: ' break-all' }}>{data.name}</td>
                                                                        <td>
                                                                            <div className="btn_size">
                                                                                {
                                                                                    data.status == 1 ? (
                                                                                        <span className="badge badge-success">{data.status == "1" ? "active" : "inactive"}</span>
                                                                                    ) : (
                                                                                            <span className="badge badge-danger">{data.status == "1" ? "active" : "inactive"}</span>
                                                                                        )
                                                                                }
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }
                                                        </tbody>
                                                    </Table>

                                                    {/* <div>
                                showing {this.state.perpage} to {this.state.items_per_page} of {this.state.count} entries
                                        </div> */}
                                                </div>
                                            ) : (
                                                    null
                                                )
                                        }
                                    </div>
                                )
                        }
                    </div>
                ) : (null)}

            </div>
        );
    }
}
