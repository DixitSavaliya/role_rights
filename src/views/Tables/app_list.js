import React from 'react';
import { Table, CustomInput, Button } from 'reactstrap';
import Switch from "react-switch";
import './table.css';
import API from '../../service';
import Swal from 'sweetalert2';
import { REMOTE_URL } from '../../redux/constants/index';
import { EventEmitter } from '../../event';
import history from '../../history';
// import './table.css';
import { HashRouter, Link, Route } from "react-router-dom";

export default class App_List extends React.Component {
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
            ownership: 1,
            ads: false,
            switch: false,
            adminownership: '',
        }

        // this.checkAllHandler = this.checkAllHandler.bind(this);
        this.deleteAppData = this.deleteAppData.bind(this);
        this.editAppData = this.editAppData.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.btnDecrementClick = this.btnDecrementClick.bind(this);
        this.btnIncrementClick = this.btnIncrementClick.bind(this);
        this.handleChangegetAds = this.handleChangegetAds.bind(this);
        this.handleLog = this.handleLog.bind(this);

        EventEmitter.subscribe('searchDataApp', (data) => {
            this.setState({
                searchData: data,
                isData: this.state.isData = true
            })
        });
    }

    componentDidMount() {
        EventEmitter.subscribe('per_page_app_value', (value) => {
            this.setState({ items_per_page: this.state.items_per_page = value });
            this.getApplicationCount();
        });

        EventEmitter.subscribe('select_app', (value) => {
            this.setState({
                ownership: this.state.ownership = value
            });
            this.getApplicationCount();
        });

        EventEmitter.subscribe('select_app_admin', (value) => {
            this.setState({
                adminownership: this.state.adminownership = value
            });
            this.getApplicationCount();
        });

        this.getApplicationCount();

    }

    getApplicationCount() {
        if (this.props.auth.auth_data.user_group == "publisher") {
            const obj = {
                user_id: this.props.auth.auth_data.id,
                user_group: this.props.auth.auth_data.user_group,
                ownership: this.state.ownership
            }
            let _this = this;
            this.props.applicationCount(obj).then((res) => {
                if (res.response.status == 1) {
                    _this.setState({
                        count: _this.state.count = res.response.data
                    })
                    _this.getApplicationPageData();
                } else {
                    Swal.fire({
                        text: res.response.message,
                        icon: 'warning'
                    });
                }
            })
        } else if (this.props.auth.auth_data.user_group == "admin") {
            const obj = {
                user_id: this.props.auth.auth_data.id,
                user_group: this.props.auth.auth_data.user_group,
                ownership: this.state.adminownership
            }
            let _this = this;
            this.props.applicationCount(obj).then(function (res) {
                if (res.response.status == 1) {
                    _this.setState({
                        count: _this.state.count = res.response.data
                    })
                    _this.getApplicationPageData();
                } else {
                    Swal.fire({
                        text: res.response.message,
                        icon: 'warning'
                    });
                }
            })
        } else {
            const obj = {
                user_id: this.props.auth.auth_data.id,
                user_group: this.props.auth.auth_data.user_group == 'advertiser' ? 'advertiser' : 'admin',
                ownership: this.state.ownership = ""
            }
            let _this = this;
            this.props.applicationCount(obj).then(function (res) {
                if (res.response.status == 1) {
                    _this.setState({
                        count: _this.state.count = res.response.data
                    })
                    _this.getApplicationPageData();
                } else {
                    Swal.fire({
                        text: res.response.message,
                        icon: 'warning'
                    });
                }
            })
        }
    }

    getApplicationPageData() {
        if (this.props.auth.auth_data.user_group == "publisher") {
            const obj = {
                page_no: "1",
                items_per_page: this.state.items_per_page,
                user_id: this.props.auth.auth_data.id,
                user_group: this.props.auth.auth_data.user_group,
                ownership: this.state.ownership
            }
            let _this = this;
            this.props.applicationPGData(obj).then(function (res) {
                if (res.response.status == 1) {
                    _this.setState({
                        paginationdata: res.response.data,
                        isFetch: true
                    })
                    EventEmitter.dispatch('isDisplay', 1);
                } else {
                    Swal.fire({
                        text: res.response.message,
                        icon: 'warning'
                    });
                }

            })
        } else if (this.props.auth.auth_data.user_group == "admin") {
            const obj = {
                page_no: "1",
                items_per_page: this.state.items_per_page,
                user_id: this.props.auth.auth_data.id,
                user_group: this.props.auth.auth_data.user_group,
                ownership: this.state.adminownership
            }
            let _this = this;
            this.props.applicationPGData(obj).then(function (res) {
                if (res.response.status == 1) {
                    _this.setState({
                        paginationdata: res.response.data,
                        isFetch: true
                    })
                    EventEmitter.dispatch('isDisplay', 1);
                } else {
                    Swal.fire({
                        text: res.response.message,
                        icon: 'warning'
                    });
                }
            })
        } else {
            const obj = {
                page_no: "1",
                items_per_page: this.state.items_per_page,
                user_id: this.props.auth.auth_data.id,
                user_group: this.props.auth.auth_data.user_group == 'advertiser' ? 'advertiser' : 'admin',
                ownership: this.state.ownership = ''
            }
            let _this = this;
            this.props.applicationPGData(obj).then(function (res) {
                if (res.response.status == 1) {
                    _this.setState({
                        paginationdata: res.response.data,
                        isFetch: true
                    })
                    EventEmitter.dispatch('isDisplay', 1);
                } else {
                    Swal.fire({
                        text: res.response.message,
                        icon: 'warning'
                    });
                }
            })
        }
    }

    editAppData(id) {
        this.props.history.push("/editapp/" + id)
    }

    deleteAppData(data) {
        const obj = {
            applicationID: data.id
        }
        var array = [];
        array.push(obj);
        const data1 = {
            data: array,
            user_id: this.props.auth.auth_data.id,
            status: data.status == 1 ? 0 : 1
        }
        if (data.status == 1) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Are you sure you want to inactive?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, inactive it!',
                cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.value) {
                    this.props.deleteApp(data1).then((res) => {
                        if (res.response.status == 1) {
                            Swal.fire({
                                text: res.response.message,
                                icon: 'success'
                            });
                            setTimeout(() => {
                                this.getApplicationPageData();
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
        } else {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Are you sure you want to active?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes,    active it!',
                cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.value) {
                    this.props.deleteApp(data1).then((res) => {
                        if (res.response.status == 1) {
                            Swal.fire({
                                text: res.response.message,
                                icon: 'success'
                            });
                            setTimeout(() => {
                                this.getApplicationPageData();
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
    }

    handleClick(event) {
        if (this.props.auth.auth_data.user_group == "publisher") {
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
                user_id: this.props.auth.auth_data.id,
                user_group: this.props.auth.auth_data.user_group,
                ownership: this.state.ownership
            }
            let _this = this;
            this.props.applicationPGData(obj).then(function (res) {
                if (res.response.status == 1) {
                    _this.setState({
                        paginationdata: res.response.data,
                        isFetch: true
                    })
                } else {
                    Swal.fire({
                        text: res.response.message,
                        icon: 'warning'
                    });
                }
            })

        } else if (this.props.auth.auth_data.user_group == "admin") {
            const obj = {
                page_no: '' + event.target.id,
                items_per_page: this.state.items_per_page,
                user_id: this.props.auth.auth_data.id,
                user_group: this.props.auth.auth_data.user_group,
                ownership: this.state.adminownership
            }
            let _this = this;
            this.props.applicationPGData(obj).then(function (res) {
                if (res.response.status == 1) {
                    _this.setState({
                        paginationdata: res.response.data,
                        isFetch: true
                    })
                    EventEmitter.dispatch('isDisplay', 1);
                } else {
                    Swal.fire({
                        text: res.response.message,
                        icon: 'warning'
                    });
                }
            })
        } else {
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
                items_per_page: this.state.items_per_page,
                user_id: this.props.auth.auth_data.id,
                user_group: this.props.auth.auth_data.user_group == 'advertiser' ? 'advertiser' : 'admin',
                ownership: this.state.ownership = ""
            }
            let _this = this;
            this.props.applicationPGData(obj).then(function (res) {
                if (res.response.status == 1) {
                    _this.setState({
                        paginationdata: res.response.data,
                        isFetch: true
                    })
                } else {
                    Swal.fire({
                        text: res.response.message,
                        icon: 'warning'
                    });
                }

            })
        }
    }

    appData(data) {
        const id = data.id;
        this.props.history.push("/viewapp/" + id)
    }

    handleLog() {

    }

    redirect(type,id) {
        if (type == 1) {
            this.props.history.push(this.props.from || { pathname: '/notifications',state:{app_id :id}});
        }
        if (type == 2) {
            this.props.history.push(this.props.from || { pathname: '/custom-ads',state:{app_id :id}});
        }
        if (type == 3) {
            this.props.history.push(this.props.from || { pathname: '/monetization-network',state:{app_id :id}});
        }
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

    addAppMonetization(app_id, status) {
        if (app_id) {

            var obj = {
                id: "",
                app_id: app_id,
                status: "1",
                data: {
                    id: "",
                    app_id: "",
                    status: "1",
                    FB_ADS: "",
                    FB_id: "",
                    FB_banner_ads: "",
                    FB_native_ads: "",
                    FB_interstitial_ads: "",
                    FB_native_banner: "",
                    FB_rewareded_ads: "",
                    GAN_ADS: "",
                    GAN_id: "",
                    GAN_banner_ads: "",
                    GAN_rewareded_ads: "",
                    GAN_interstitial_ads: "",
                    GAN_native_banner: "",
                    GAN_native_ads: "",
                    MO_id: "",
                    MO_native_ads: "",
                    MO_banner_ads: "",
                    MO_interstitial_ads: "",
                    MO_ADS: "",
                    MO_rewareded_ads: "",
                    MO_native_banner: "",
                }
            }

            this.props.AddAppMonetization(obj).then((res) => {
                if (res.response.status == 1) {
                    Swal.fire({
                        text: res.response.message,
                        icon: 'success'
                    });
                    this.getApplicationPageData();
                } else {
                    Swal.fire({
                        text: res.response.message,
                        icon: 'warning'
                    });
                }
            })

        } else {
            Swal.fire("Please Select App First!", "", "warning");
        }
    }

    handleChangegetAds(data, index) {
        if (data.ad_id != null) {
            if (data.ad_status == 1) {
                if (data.ad_id != null) {
                    const obj = {
                        id: data.ad_id
                    }
                    this.props.activeAppAds(obj).then((res) => {
                        if (res.response.status == 1) {
                            this.getApplicationPageData();
                        } else {
                            Swal.fire({
                                text: res.response.message,
                                icon: 'warning'
                            });
                        }

                    })
                }
            } else {
                if (data.ad_id != null) {
                    const obj = {
                        id: data.ad_id
                    }
                    this.props.InactiveAppAds(obj).then((res) => {
                        if (res.response.status == 1) {
                            this.getApplicationPageData();
                        } else {
                            Swal.fire({
                                text: res.response.message,
                                icon: 'warning'
                            });
                        }
                    })
                }
            }
        } else {
            this.addAppMonetization(data.id, data.ad_status);
        }

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
                {
                    this.state.isData == false ? (
                        <div>
                            {
                                this.state.paginationdata ? (
                                    <div>
                                       
                                        Hello
                                    </div>
                                ) : (
                                        null
                                    )
                            }

                        </div>
                    ) : (
                            <div>
                                <Table hover className="mb-0" bordered>
                                    <thead>
                                        <tr>
                                            {this.props.auth.auth_data.user_group == 'publisher' || this.props.auth.auth_data.user_group == 'advertiser' ? (<th className="action">Action</th>) : (null)}
                                            {this.props.auth.auth_data.user_group == 'publisher' ? (<th style={{ width: '85px', fontSize: '12px', fontWeight: '600' }}>Manage Ads</th>) : (null)}
                                            <th style={{ width: '80px', fontSize: '12px', fontWeight: '600' }}>App Icon</th>
                                            <th style={{ width: '170px', fontSize: '12px', fontWeight: '600' }}>Name</th>
                                            <th style={{ width: '200px', fontSize: '12px', fontWeight: '600' }}>Package</th>
                                            {this.props.auth.auth_data.user_group == 'publisher' ? (<th style={{ width: '230px', fontSize: '12px', fontWeight: '600' }}>Features</th>) : (null)}

                                            {
                                                this.props.auth.auth_data.user_group == 'admin' ? (
                                                    <th style={{ width: '80px', fontSize: '12px', fontWeight: '600' }}>OwnerShip</th>
                                                ) : (
                                                        null
                                                    )
                                            }
                                            {
                                                this.props.auth.auth_data.user_group == 'admin' ? (
                                                    <th style={{ width: '80px', fontSize: '12px', fontWeight: '600' }}>OwnerName</th>
                                                ) : (
                                                        null
                                                    )
                                            }

                                            {/* <th>Discription</th> */}
                                            <th style={{ width: '55px', fontSize: '12px', fontWeight: '600' }}>status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.searchData.map((data, index) =>
                                                <tr key={index}>
                                                    {
                                                        auth.user_group == "publisher" ? (
                                                            <td className="action">
                                                                {auth.id == data.user_id && auth.user_group == data.owner ? (
                                                                    <span className="padding">
                                                                        <i className="fa fa-pencil-square fa-lg" onClick={() => this.editAppData(data.id)}></i>
                                                                        {
                                                                            data.status == "1" ? (
                                                                                <i className="fa fa-remove fa-lg" onClick={() => this.deleteAppData(data)}></i>
                                                                            ) : (
                                                                                    <i className="fa fa-check" onClick={() => this.deleteAppData(data)}></i>
                                                                                )
                                                                        }
                                                                    </span>
                                                                ) : (
                                                                        <span className="padding">
                                                                            No Access
                                                                        </span>
                                                                    )}
                                                            </td>
                                                        ) : (

                                                                null

                                                            )
                                                    }
                                                    {
                                                        auth.user_group == "advertiser" ? (
                                                            <td className="action">
                                                                <span className="padding">
                                                                    <i className="fa fa-pencil-square fa-lg" onClick={() => this.editAppData(data.id)}></i>
                                                                    {
                                                                        data.status == "1" ? (
                                                                            <i className="fa fa-remove fa-lg" onClick={() => this.deleteAppData(data)}></i>
                                                                        ) : (
                                                                                <i className="fa fa-check" onClick={() => this.deleteAppData(data)}></i>
                                                                            )
                                                                    }
                                                                </span>
                                                            </td>
                                                        ) : (
                                                                null
                                                            )
                                                    }
                                                    {
                                                        this.props.auth.auth_data.user_group == 'publisher' ? (
                                                            <td>
                                                                {
                                                                    data.owner !== 'advertiser' ? (
                                                                        <Switch
                                                                            checked={data.ad_status == 1 ? true : false}
                                                                            onChange={() => this.handleChangegetAds(data, index)}
                                                                        />
                                                                    ) : (
                                                                            <Switch
                                                                                checked={data.ad_status == 1 ? true : false}
                                                                                onChange={() => this.handleLog()}
                                                                            />
                                                                        )
                                                                }
                                                            </td>
                                                        ) : (null)
                                                    }
                                                    <td onClick={() => this.appData(data)}>
                                                        {
                                                            data.icon != null ? (
                                                                <img src={REMOTE_URL + data.icon} className="avatar-img" alt="admin@bootstrapmaster.com" />
                                                            ) : (
                                                                    <img src={require('../../../public/img/2.png')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                                                                )
                                                        }

                                                    </td>
                                                    <td onClick={() => this.appData(data)} style={{ wordBreak: ' break-all' }}>{data.name}</td>
                                                    <td onClick={() => this.appData(data)} style={{ wordBreak: ' break-all' }}>{data.package}</td>
                                                    {this.props.auth.auth_data.user_group == 'publisher' ?
                                                        (
                                                            <td>
                                                                {
                                                                    data.owner !== 'advertiser' ? (
                                                                        <div className="btn-group" style={{ display: 'block', marginTop: '5px' }}>
                                                                            <Button size="sm" className="btn-theme" color="warning" style={{ color: '#fff' }} onClick={() => this.redirect(1)}>Notification</Button>
                                                                            <Button size="sm" className="btn-theme" color="danger" style={{ marginLeft: '7px' }} onClick={() => this.redirect(2)}>Custom Ads</Button>
                                                                            <Button size="sm" className="btn-theme" color="primary" style={{ marginLeft: '7px', marginTop: '0px' }} onClick={() => this.redirect(3)}>Ads</Button>
                                                                        </div>
                                                                    ) : (
                                                                            <div className="btn-group" style={{ display: 'block', marginTop: '5px' }}>
                                                                                <Button size="sm" className="btn-theme" color="warning" style={{ color: '#fff' }} disabled>Notification</Button>
                                                                                <Button size="sm" className="btn-theme" color="danger" style={{ marginLeft: '7px' }} disabled>Custom Ads</Button>
                                                                                <Button size="sm" className="btn-theme" color="primary" style={{ marginLeft: '7px', marginTop: '0px' }} disabled>Ads</Button>
                                                                            </div>
                                                                        )
                                                                }
                                                            </td>
                                                        ) :
                                                        (null)}
                                                    {/* <td onClick={() => this.appData(data)}>{data.description}</td> */}
                                                    {
                                                        this.props.auth.auth_data.user_group == 'admin' ? (
                                                            <td onClick={() => this.appData(data)} style={{ textTransform: 'uppercase' }}>{data.owner}</td>
                                                        ) : (
                                                                null
                                                            )
                                                    }
                                                    {
                                                        this.props.auth.auth_data.user_group == 'admin' ? (
                                                            <td onClick={() => this.appData(data)} style={{ textTransform: 'uppercase' }}>{data.owner_name}</td>
                                                        ) : (
                                                                null
                                                            )
                                                    }
                                                    <td onClick={() => this.appData(data)}>
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
                            </div>
                        )
                }
            </div>
        );
    }
}
