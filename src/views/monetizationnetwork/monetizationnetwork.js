import React, { Fragment } from 'react';
import Swal from 'sweetalert2';
import Switch from "react-switch";
import { EventEmitter } from '../../event';
import { Link } from 'react-router-dom';
import { REMOTE_URL } from '../../redux/constants/index';
import checkRights from '../../rights';
import Auth from '../../redux/Auth';
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
import thunk from 'redux-thunk';

class MonetizationNetwork extends React.Component {

    /** First Constructor Call */
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            app_id: '',
            publisherapp: '',
            FB_id: '',
            FB_rewareded_ads: '',
            fb_interstitial: '',
            fb_banner: '',
            fb_native_banner: '',
            fb_native: '',
            admob_appid: '',
            admob_interstitial: '',
            admob_banner: '',
            admob_native_banner: '',
            GAN_native_ads: '',
            admob_rewarded: '',
            MO_id: '',
            mopub_interstitial: '',
            mopub_banner: '',
            mopub_native_banner: '',
            mopub_native: '',
            mopub_video: '',
            mopub_reward_video: '',
            checked: false,
            mopub_ads: false,
            admob_ads: false,
            fb_ads: true,
            updateMonetization: false,
            mainAds: false,
            showsection: false,
            items: [],
            selectApp: null,
            flag: 1,
            rightdata: ''
        }
        this.handleChangeFBAds = this.handleChangeFBAds.bind(this);
        this.handleChangeAdMobAds = this.handleChangeAdMobAds.bind(this);
        this.handleChangeMopubAds = this.handleChangeMopubAds.bind(this);
        this.addAppMonetization = this.addAppMonetization.bind(this);
        this.UpdateAppMonetization = this.UpdateAppMonetization.bind(this);
        this.handleChangeMainAds = this.handleChangeMainAds.bind(this);
        this.removeAppMonetization = this.removeAppMonetization.bind(this);
        this.filterList = this.filterList.bind(this);
        this.handleAppClick = this.handleAppClick.bind(this);
        this.showApp = this.showApp.bind(this);
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
        if (this.props.history.location.state != null) {
            let appId = this.props.history.location.state.app_id;
            const data = {
                application_id: appId
            }
            this.props.getViewApplicationDetailsById(data).then((res) => {
                this.showApp(res.response.data.id, res.response.data);
            })
        }

        const obj = {
            user_id: this.props.auth.auth_data.id,
            user_group: this.props.auth.auth_data.user_group,
            search_string: ''
        }
        this.props.getPublisherApplication(obj).then((res) => {
            this.setState({
                publisherapp: res.response.data
            })
        })
    }

    showApp(id, item) {
        this.setState({
            selectApp: this.state.selectApp = item
        })
        let _id = id;
        this.setState({
            app_id: this.state.app_id = _id,
            showsection: this.state.showsection = true
        })
        const obj = {
            id: this.state.id,
            app_id: this.state.app_id
        }
        this.props.getAPPMonetization(obj).then((res) => {
            if (res.response.data) {
                if (res.response.message == "No Monetisations Found For This Application!") {
                    this.setState({
                        updateMonetization: this.state.updateMonetization = false,
                        fb_ads: this.state.fb_ads = true,
                        FB_id: this.state.FB_id = "",
                        FB_rewareded_ads: this.state.FB_rewareded_ads = "",
                        fb_ads: this.state.fb_ads = "",
                        fb_banner: this.state.fb_banner = "",
                        fb_native: this.state.fb_native = "",
                        fb_interstitial: this.state.fb_interstitial = "",
                        fb_native_banner: this.state.fb_native_banner = "",
                        GAN_native_ads: this.state.GAN_native_ads = "",
                        admob_ads: this.state.admob_ads = "",
                        admob_banner: this.state.admob_banner = "",
                        admob_appid: this.state.admob_appid = "",
                        admob_rewarded: this.state.admob_rewarded = "",
                        admob_interstitial: this.state.admob_interstitial = "",
                        admob_native_banner: this.state.admob_native_banner = "",
                        mopub_ads: this.state.mopub_ads = "",
                        MO_id: this.state.MO_id = "",
                        mopub_video: this.state.mopub_video = "",
                        mopub_banner: this.state.mopub_banner = "",
                        mopub_interstitial: this.state.mopub_interstitial = "",
                        mopub_reward_video: this.state.mopub_reward_video = "",
                        mopub_native_banner: this.state.mopub_native_banner = ""
                    })
                } else {
                    if (res.response.data.data.FB_ADS == "" && res.response.data.data.GAN_ADS == "" && res.response.data.data.MO_ADS == "") {
                        this.setState({
                            mainAds: this.state.mainAds = true,
                            id: this.state.id = res.response.data.id,
                            updateMonetization: this.state.updateMonetization = true,
                            FB_id: this.state.FB_id = res.response.data.data.FB_id,
                            FB_rewareded_ads: this.state.FB_rewareded_ads = res.response.data.data.FB_rewareded_ads,
                            fb_ads: this.state.fb_ads = res.response.data.data.FB_ADS,
                            fb_banner: this.state.fb_banner = res.response.data.data.FB_banner_ads,
                            fb_native: this.state.fb_native = res.response.data.data.FB_native_ads,
                            fb_interstitial: this.state.fb_interstitial = res.response.data.data.FB_interstitial_ads,
                            fb_native_banner: this.state.fb_native_banner = res.response.data.data.FB_native_banner,
                            GAN_native_ads: this.state.GAN_native_ads = res.response.data.data.GAN_native_ads,
                            admob_ads: this.state.admob_ads = res.response.data.data.GAN_ADS,
                            admob_banner: this.state.admob_banner = res.response.data.data.GAN_banner_ads,
                            admob_appid: this.state.admob_appid = res.response.data.data.GAN_id,
                            admob_rewarded: this.state.admob_rewarded = res.response.data.data.GAN_rewareded_ads,
                            admob_interstitial: this.state.admob_interstitial = res.response.data.data.GAN_interstitial_ads,
                            admob_native_banner: this.state.admob_native_banner = res.response.data.data.GAN_native_banner,
                            mopub_ads: this.state.mopub_ads = res.response.data.data.MO_ADS,
                            MO_id: this.state.MO_id = res.response.data.data.MO_id,
                            mopub_video: this.state.mopub_video = res.response.data.data.MO_native_ads,
                            mopub_banner: this.state.mopub_banner = res.response.data.data.MO_banner_ads,
                            mopub_interstitial: this.state.mopub_interstitial = res.response.data.data.MO_interstitial_ads,
                            mopub_reward_video: this.state.mopub_reward_video = res.response.data.data.MO_rewareded_ads,
                            mopub_native_banner: this.state.mopub_native_banner = res.response.data.data.MO_native_banner
                        })
                    } else {
                        this.setState({
                            mainAds: this.state.mainAds = res.response.data.data.FB_ADS == false && res.response.data.data.GAN_ADS == false && res.response.data.data.MO_ADS == false ? false : true,
                            id: this.state.id = res.response.data.id,
                            updateMonetization: this.state.updateMonetization = true,
                            FB_id: this.state.FB_id = res.response.data.data.FB_id,
                            FB_rewareded_ads: this.state.FB_rewareded_ads = res.response.data.data.FB_rewareded_ads,
                            fb_ads: this.state.fb_ads = res.response.data.data.FB_ADS,
                            fb_banner: this.state.fb_banner = res.response.data.data.FB_banner_ads,
                            fb_native: this.state.fb_native = res.response.data.data.FB_native_ads,
                            fb_interstitial: this.state.fb_interstitial = res.response.data.data.FB_interstitial_ads,
                            fb_native_banner: this.state.fb_native_banner = res.response.data.data.FB_native_banner,
                            GAN_native_ads: this.state.GAN_native_ads = res.response.data.data.GAN_native_ads,
                            admob_ads: this.state.admob_ads = res.response.data.data.GAN_ADS,
                            admob_banner: this.state.admob_banner = res.response.data.data.GAN_banner_ads,
                            admob_appid: this.state.admob_appid = res.response.data.data.GAN_id,
                            admob_rewarded: this.state.admob_rewarded = res.response.data.data.GAN_rewareded_ads,
                            admob_interstitial: this.state.admob_interstitial = res.response.data.data.GAN_interstitial_ads,
                            admob_native_banner: this.state.admob_native_banner = res.response.data.data.GAN_native_banner,
                            mopub_ads: this.state.mopub_ads = res.response.data.data.MO_ADS,
                            MO_id: this.state.MO_id = res.response.data.data.MO_id,
                            mopub_video: this.state.mopub_video = res.response.data.data.MO_native_ads,
                            mopub_banner: this.state.mopub_banner = res.response.data.data.MO_banner_ads,
                            mopub_interstitial: this.state.mopub_interstitial = res.response.data.data.MO_interstitial_ads,
                            mopub_reward_video: this.state.mopub_reward_video = res.response.data.data.MO_rewareded_ads,
                            mopub_native_banner: this.state.mopub_native_banner = res.response.data.data.MO_native_banner
                        })
                    }
                }
            }
        })
        this.setState({
            items: this.state.items = []
        })
        this.state.items = [];
        document.getElementById('searchInput').value = '';
    }

    handleAppClick(event, item) {
        this.setState({
            selectApp: this.state.selectApp = item
        })
        let _id = event;
        this.setState({
            app_id: this.state.app_id = _id,
            showsection: this.state.showsection = true
        })
        const obj = {
            id: this.state.id,
            app_id: this.state.app_id
        }
        this.props.getAPPMonetization(obj).then((res) => {
            if (res.response.data) {
                if (res.response.message == "No Monetisations Found For This Application!") {
                    this.setState({
                        updateMonetization: this.state.updateMonetization = false,
                        fb_ads: this.state.fb_ads = true,
                        FB_id: this.state.FB_id = "",
                        FB_rewareded_ads: this.state.FB_rewareded_ads = "",
                        fb_ads: this.state.fb_ads = "",
                        fb_banner: this.state.fb_banner = "",
                        fb_native: this.state.fb_native = "",
                        fb_interstitial: this.state.fb_interstitial = "",
                        fb_native_banner: this.state.fb_native_banner = "",
                        GAN_native_ads: this.state.GAN_native_ads = "",
                        admob_ads: this.state.admob_ads = "",
                        admob_banner: this.state.admob_banner = "",
                        admob_appid: this.state.admob_appid = "",
                        admob_rewarded: this.state.admob_rewarded = "",
                        admob_interstitial: this.state.admob_interstitial = "",
                        admob_native_banner: this.state.admob_native_banner = "",
                        mopub_ads: this.state.mopub_ads = "",
                        MO_id: this.state.MO_id = "",
                        mopub_video: this.state.mopub_video = "",
                        mopub_banner: this.state.mopub_banner = "",
                        mopub_interstitial: this.state.mopub_interstitial = "",
                        mopub_reward_video: this.state.mopub_reward_video = "",
                        mopub_native_banner: this.state.mopub_native_banner = ""
                    })
                } else {
                    if (res.response.data.data.FB_ADS == "" && res.response.data.data.GAN_ADS == "" && res.response.data.data.MO_ADS == "") {
                        this.setState({
                            mainAds: this.state.mainAds = true,
                            id: this.state.id = res.response.data.id,
                            updateMonetization: this.state.updateMonetization = true,
                            FB_id: this.state.FB_id = res.response.data.data.FB_id,
                            FB_rewareded_ads: this.state.FB_rewareded_ads = res.response.data.data.FB_rewareded_ads,
                            fb_ads: this.state.fb_ads = res.response.data.data.FB_ADS,
                            fb_banner: this.state.fb_banner = res.response.data.data.FB_banner_ads,
                            fb_native: this.state.fb_native = res.response.data.data.FB_native_ads,
                            fb_interstitial: this.state.fb_interstitial = res.response.data.data.FB_interstitial_ads,
                            fb_native_banner: this.state.fb_native_banner = res.response.data.data.FB_native_banner,
                            GAN_native_ads: this.state.GAN_native_ads = res.response.data.data.GAN_native_ads,
                            admob_ads: this.state.admob_ads = res.response.data.data.GAN_ADS,
                            admob_banner: this.state.admob_banner = res.response.data.data.GAN_banner_ads,
                            admob_appid: this.state.admob_appid = res.response.data.data.GAN_id,
                            admob_rewarded: this.state.admob_rewarded = res.response.data.data.GAN_rewareded_ads,
                            admob_interstitial: this.state.admob_interstitial = res.response.data.data.GAN_interstitial_ads,
                            admob_native_banner: this.state.admob_native_banner = res.response.data.data.GAN_native_banner,
                            mopub_ads: this.state.mopub_ads = res.response.data.data.MO_ADS,
                            MO_id: this.state.MO_id = res.response.data.data.MO_id,
                            mopub_video: this.state.mopub_video = res.response.data.data.MO_native_ads,
                            mopub_banner: this.state.mopub_banner = res.response.data.data.MO_banner_ads,
                            mopub_interstitial: this.state.mopub_interstitial = res.response.data.data.MO_interstitial_ads,
                            mopub_reward_video: this.state.mopub_reward_video = res.response.data.data.MO_rewareded_ads,
                            mopub_native_banner: this.state.mopub_native_banner = res.response.data.data.MO_native_banner
                        })
                    } else {
                        this.setState({
                            mainAds: this.state.mainAds = res.response.data.data.FB_ADS == false && res.response.data.data.GAN_ADS == false && res.response.data.data.MO_ADS == false ? false : true,
                            id: this.state.id = res.response.data.id,
                            updateMonetization: this.state.updateMonetization = true,
                            FB_id: this.state.FB_id = res.response.data.data.FB_id,
                            FB_rewareded_ads: this.state.FB_rewareded_ads = res.response.data.data.FB_rewareded_ads,
                            fb_ads: this.state.fb_ads = res.response.data.data.FB_ADS,
                            fb_banner: this.state.fb_banner = res.response.data.data.FB_banner_ads,
                            fb_native: this.state.fb_native = res.response.data.data.FB_native_ads,
                            fb_interstitial: this.state.fb_interstitial = res.response.data.data.FB_interstitial_ads,
                            fb_native_banner: this.state.fb_native_banner = res.response.data.data.FB_native_banner,
                            GAN_native_ads: this.state.GAN_native_ads = res.response.data.data.GAN_native_ads,
                            admob_ads: this.state.admob_ads = res.response.data.data.GAN_ADS,
                            admob_banner: this.state.admob_banner = res.response.data.data.GAN_banner_ads,
                            admob_appid: this.state.admob_appid = res.response.data.data.GAN_id,
                            admob_rewarded: this.state.admob_rewarded = res.response.data.data.GAN_rewareded_ads,
                            admob_interstitial: this.state.admob_interstitial = res.response.data.data.GAN_interstitial_ads,
                            admob_native_banner: this.state.admob_native_banner = res.response.data.data.GAN_native_banner,
                            mopub_ads: this.state.mopub_ads = res.response.data.data.MO_ADS,
                            MO_id: this.state.MO_id = res.response.data.data.MO_id,
                            mopub_video: this.state.mopub_video = res.response.data.data.MO_native_ads,
                            mopub_banner: this.state.mopub_banner = res.response.data.data.MO_banner_ads,
                            mopub_interstitial: this.state.mopub_interstitial = res.response.data.data.MO_interstitial_ads,
                            mopub_reward_video: this.state.mopub_reward_video = res.response.data.data.MO_rewareded_ads,
                            mopub_native_banner: this.state.mopub_native_banner = res.response.data.data.MO_native_banner
                        })
                    }
                }
            }
        })
        this.setState({
            items: this.state.items = []
        })
        this.state.items = [];
        document.getElementById('searchInput').value = '';
    }

    handleChangeFBAds(checkedvalue) {
        this.setState({
            fb_ads: this.state.fb_ads = checkedvalue
        })
        if (this.state.fb_ads == true) {
            this.setState({
                admob_ads: this.state.admob_ads = false,
                mopub_ads: this.state.mopub_ads = false
            })
        }
    }

    handleChangeAdMobAds(checkedvalue) {
        this.setState({
            admob_ads: this.state.admob_ads = checkedvalue
        })
        if (this.state.admob_ads == true) {
            this.setState({
                fb_ads: this.state.fb_ads = false,
                mopub_ads: this.state.mopub_ads = false
            })
        }
    }

    handleChangeMopubAds(checkedvalue) {
        this.setState({
            mopub_ads: this.state.mopub_ads = checkedvalue
        })
        if (this.state.mopub_ads == true) {
            this.setState({
                fb_ads: this.state.fb_ads = false,
                admob_ads: this.state.admob_ads = false
            })
        }
    }

    handleChangeMainAds(checkedvalue) {
        this.setState({
            mainAds: this.state.mainAds = checkedvalue
        })
        if (this.state.mopub_ads == false) {
            this.setState({
                fb_ads: this.state.fb_ads = false,
                admob_ads: this.state.admob_ads = false,
                mopub_ads: this.state.mopub_ads = false
            })
        }
        this.UpdateAppMonetization();
    }

    addAppMonetization() {
        if (this.state.fb_ads == false && this.state.admob_ads == false && this.state.mopub_ads == false) {
            if (this.state.app_id) {
                var obj = {
                    id: this.state.id,
                    app_id: this.state.app_id,
                    status: "0",
                    data: {
                        id: this.state.id,
                        app_id: this.state.app_id,
                        status: "0",
                        FB_ADS: this.state.fb_ads,
                        FB_id: this.state.FB_id,
                        FB_banner_ads: this.state.fb_banner,
                        FB_native_ads: this.state.fb_native,
                        FB_interstitial_ads: this.state.fb_interstitial,
                        FB_native_banner: this.state.fb_native_banner,
                        FB_rewareded_ads: this.state.FB_rewareded_ads,
                        GAN_ADS: this.state.admob_ads,
                        GAN_id: this.state.admob_appid,
                        GAN_banner_ads: this.state.admob_banner,
                        GAN_rewareded_ads: this.state.admob_rewarded,
                        GAN_interstitial_ads: this.state.admob_interstitial,
                        GAN_native_banner: this.state.admob_native_banner,
                        GAN_native_ads: this.state.GAN_native_ads,
                        MO_id: this.state.MO_id,
                        MO_native_ads: this.state.mopub_video,
                        MO_banner_ads: this.state.mopub_banner,
                        MO_interstitial_ads: this.state.mopub_interstitial,
                        MO_ADS: this.state.mopub_ads,
                        MO_rewareded_ads: this.state.mopub_reward_video,
                        MO_native_banner: this.state.mopub_native_banner
                    }
                }

                this.props.AddAppMonetization(obj).then((res) => {
                    if (res.response.status == 1) {
                        this.setState({
                            updateMonetization: this.state.updateMonetization = true
                        })
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
                })

            } else {
                Swal.fire("Please Select App First!", "", "warning");
            }
        } else {
            if (this.state.app_id) {
                // this.state.mainAds == true
                var obj = {
                    id: this.state.id,
                    app_id: this.state.app_id,
                    status: "1",
                    data: {
                        id: this.state.id,
                        app_id: this.state.app_id,
                        status: "1",
                        FB_ADS: this.state.fb_ads,
                        FB_id: this.state.FB_id,
                        FB_banner_ads: this.state.fb_banner,
                        FB_native_ads: this.state.fb_native,
                        FB_interstitial_ads: this.state.fb_interstitial,
                        FB_native_banner: this.state.fb_native_banner,
                        FB_rewareded_ads: this.state.FB_rewareded_ads,
                        GAN_ADS: this.state.admob_ads,
                        GAN_id: this.state.admob_appid,
                        GAN_banner_ads: this.state.admob_banner,
                        GAN_rewareded_ads: this.state.admob_rewarded,
                        GAN_interstitial_ads: this.state.admob_interstitial,
                        GAN_native_banner: this.state.admob_native_banner,
                        GAN_native_ads: this.state.GAN_native_ads,
                        MO_id: this.state.MO_id,
                        MO_native_ads: this.state.mopub_video,
                        MO_banner_ads: this.state.mopub_banner,
                        MO_interstitial_ads: this.state.mopub_interstitial,
                        MO_ADS: this.state.mopub_ads,
                        MO_rewareded_ads: this.state.mopub_reward_video,
                        MO_native_banner: this.state.mopub_native_banner
                    }
                }

                this.props.AddAppMonetization(obj).then((res) => {
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
                })

            } else {
                Swal.fire("Please Select App First!", "", "warning");
            }
        }
    }

    UpdateAppMonetization() {
        if (this.state.fb_ads == false && this.state.admob_ads == false && this.state.mopub_ads == false) {
            if (this.state.app_id) {
                var obj = {
                    id: this.state.id,
                    app_id: this.state.app_id,
                    status: "0",
                    data: {
                        id: this.state.id,
                        app_id: this.state.app_id,
                        status: "0",
                        FB_ADS: this.state.fb_ads,
                        FB_id: this.state.FB_id,
                        FB_banner_ads: this.state.fb_banner,
                        FB_native_ads: this.state.fb_native,
                        FB_interstitial_ads: this.state.fb_interstitial,
                        FB_native_banner: this.state.fb_native_banner,
                        FB_rewareded_ads: this.state.FB_rewareded_ads,
                        GAN_ADS: this.state.admob_ads,
                        GAN_id: this.state.admob_appid,
                        GAN_banner_ads: this.state.admob_banner,
                        GAN_rewareded_ads: this.state.admob_rewarded,
                        GAN_interstitial_ads: this.state.admob_interstitial,
                        GAN_native_banner: this.state.admob_native_banner,
                        GAN_native_ads: this.state.GAN_native_ads,
                        MO_id: this.state.MO_id,
                        MO_native_ads: this.state.mopub_video,
                        MO_banner_ads: this.state.mopub_banner,
                        MO_interstitial_ads: this.state.mopub_interstitial,
                        MO_ADS: this.state.mopub_ads,
                        MO_rewareded_ads: this.state.mopub_reward_video,
                        MO_native_banner: this.state.mopub_native_banner
                    }
                }

                this.props.updateAppMonetization(obj).then((res) => {
                    if (res.response.status == 1) {
                        this.setState({
                            updateMonetization: this.state.updateMonetization = true
                        })
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
                })

            } else {
                Swal.fire("Please Active Main Switch!", "", "warning");
            }
        } else {
            if (this.state.app_id && this.state.mainAds == true) {
                var obj = {
                    id: this.state.id,
                    app_id: this.state.app_id,
                    status: "1",
                    data: {
                        id: this.state.id,
                        app_id: this.state.app_id,
                        status: "1",
                        FB_ADS: this.state.fb_ads,
                        FB_id: this.state.FB_id,
                        FB_banner_ads: this.state.fb_banner,
                        FB_native_ads: this.state.fb_native,
                        FB_interstitial_ads: this.state.fb_interstitial,
                        FB_native_banner: this.state.fb_native_banner,
                        FB_rewareded_ads: this.state.FB_rewareded_ads,
                        GAN_ADS: this.state.admob_ads,
                        GAN_id: this.state.admob_appid,
                        GAN_banner_ads: this.state.admob_banner,
                        GAN_rewareded_ads: this.state.admob_rewarded,
                        GAN_interstitial_ads: this.state.admob_interstitial,
                        GAN_native_banner: this.state.admob_native_banner,
                        GAN_native_ads: this.state.GAN_native_ads,
                        MO_id: this.state.MO_id,
                        MO_native_ads: this.state.mopub_video,
                        MO_banner_ads: this.state.mopub_banner,
                        MO_interstitial_ads: this.state.mopub_interstitial,
                        MO_ADS: this.state.mopub_ads,
                        MO_rewareded_ads: this.state.mopub_reward_video,
                        MO_native_banner: this.state.mopub_native_banner
                    }
                }

                this.props.updateAppMonetization(obj).then((res) => {
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
                })

            } else {
                Swal.fire("Please Select App First!", "", "warning");
            }
        }
    }

    removeAppMonetization() {
        if (this.state.app_id) {
            var obj = {
                id: this.state.id,
                app_id: this.state.app_id,
                status: "0",
                data: {
                    id: this.state.id,
                    app_id: this.state.app_id,
                    status: "0",
                    FB_ADS: this.state.fb_ads,
                    FB_id: this.state.FB_id,
                    FB_banner_ads: this.state.fb_banner,
                    FB_native_ads: this.state.fb_native,
                    FB_interstitial_ads: this.state.fb_interstitial,
                    FB_native_banner: this.state.fb_native_banner,
                    FB_rewareded_ads: this.state.FB_rewareded_ads,
                    GAN_ADS: this.state.admob_ads,
                    GAN_id: this.state.admob_appid,
                    GAN_banner_ads: this.state.admob_banner,
                    GAN_rewareded_ads: this.state.admob_rewarded,
                    GAN_interstitial_ads: this.state.admob_interstitial,
                    GAN_native_banner: this.state.admob_native_banner,
                    GAN_native_ads: this.state.GAN_native_ads,
                    MO_id: this.state.MO_id,
                    MO_native_ads: this.state.mopub_video,
                    MO_banner_ads: this.state.mopub_banner,
                    MO_interstitial_ads: this.state.mopub_interstitial,
                    MO_ADS: this.state.mopub_ads,
                    MO_rewareded_ads: this.state.mopub_reward_video,
                    MO_native_banner: this.state.mopub_native_banner
                }
            }
            this.props.RemoveAppMonetization(obj).then((res) => {
                if (res.response.status == 1) {
                    this.setState({
                        updateMonetization: this.state.updateMonetization = false
                    })
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
            })
        }
    }

    filterList(event) {
        //response of api call
        const obj = {
            search_string: event.target.value,
            user_id: this.props.auth.auth_data.id,
            user_group: this.props.auth.auth_data.user_group,
            ownership: this.state.ownership = 1
        }
        this.props.searchApplicationData(obj).then((res) => {
            this.setState({
                items: this.state.searchData = res.response.data
            })
        });
    }

    render() {
        const { auth, applicationCount, applicationPGData, deleteApp } = this.props;
        return (
            <div>
                {(checkRights('advertisement', 'read') == true) && (checkRights('monetization', 'read') == true) ? (
                    <div>
                        <Row style={{ height: '170px' }}>
                            <Col xl="3" lg="3" md="4">
                                <Form>
                                    <FormGroup>
                                        {/* <Label for="exampleCustomSelect"><b>Select Application</b></Label> */}
                                        <div className="filter-list">
                                            <fieldset className="form-group">
                                                <input
                                                    type="text"
                                                    id="searchInput"
                                                    className="form-control form-control-lg"
                                                    placeholder="Search Application.."
                                                    onChange={this.filterList}
                                                />
                                            </fieldset>
                                            <ul className="list-group">{
                                                this.state.items.map((item, index) =>
                                                    <li className="list-group-item" key={index} value={item.id} onClick={() => this.handleAppClick(item.id, item)}>
                                                        <img style={{ width: '70px', height: '50px', padding: '0 10px', borderRadius: '7px', display: 'inline-block', marginTop: '3px' }} src={REMOTE_URL + item.icon} />
                                                        <p style={{ wordBreak: 'break-all', padding: '0 10px', display: 'inline-block', verticalAlign: 'top', width: 'calc(100% - 70px)' }}>
                                                            {item.name}<br />
                                                            <small style={{ wordBreak: 'break-all', paddingTop: '0px', display: 'inline-block', wordBreak: 'break-all' }}>{item.package}</small>
                                                        </p>
                                                    </li>
                                                )
                                            }</ul>
                                        </div>
                                        {/* <Input
                                    type="select"
                                    id="exampleCustomSelect"
                                    name="customSelect"
                                    onChange={this.onItemSelect}
                                >
                                    <option value="">Select MyApp:</option>
                                    {
                                        this.state.publisherapp.length > 0 ? this.state.publisherapp.map((data, index) =>
                                            <option key={data.id} value={data.id}>{data.name} - ({data.package})</option>
                                        ) : ''
                                    }
                                </Input> */}
                                    </FormGroup>
                                </Form>
                            </Col>
                            {
                                this.state.selectApp != null ? (
                                    <Col md="4">
                                        <Card>
                                            <CardHeader>
                                                <strong style={{ color: '#20a8d8', fontSize: '20px' }}>Selected Application</strong>
                                            </CardHeader>
                                            <CardBody>
                                                <Row>
                                                    <Col md="3">
                                                        <img src={REMOTE_URL + this.state.selectApp.icon} style={{ height: '50px' }} className="app-img" alt="admin@bootstrapmaster.com" />
                                                    </Col>
                                                    <Col md="9" className="content">
                                                        <div className="app_detail">

                                                            <h5 style={{ wordBreak: ' break-all' }}>{this.state.selectApp.name}</h5>
                                                            <h6 style={{ wordBreak: ' break-all' }}>{this.state.selectApp.package}</h6>
                                                            {/* {
                                                    this.state.advertiserapp[index]['_rowChecked'] == true ? (
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
                                    </Col>
                                ) : (
                                        null
                                    )
                            }

                            {
                                this.state.updateMonetization == false ? (
                                    null
                                ) : (
                                        <Col md="1" style={{ textAlign: 'end' }}>
                                            {(checkRights('monetization', 'write') == true) ? (
                                                <Row>
                                                    <Col md="8">
                                                        <span style={{ color: 'black', fontSize: '16px' }}>Inactive Ads:</span>
                                                    </Col>
                                                    <Col md="4">
                                                        <Switch onChange={this.handleChangeMainAds} checked={this.state.mainAds} />
                                                    </Col>
                                                </Row>
                                            ) : (null)}

                                        </Col>
                                    )
                            }

                            <Col md="4">
                                <div className="btn-group">
                                    {
                                        this.state.updateMonetization == false ? (
                                            null
                                        ) : (
                                                <div>
                                                    {
                                                        this.state.updateMonetization == false ? (
                                                            null

                                                        ) : (
                                                                <div>
                                                                    {(checkRights('monetization', 'write') == true) && (checkRights('monetization', 'delete') == true) ? (
                                                                        <Button className="" color="danger" onClick={this.removeAppMonetization}>
                                                                            Remove Advertisment
                                                                        </Button>
                                                                    ) : (null)}
                                                                </div>

                                                            )
                                                    }
                                                </div>

                                            )
                                    }
                                    {
                                        this.state.showsection == true ? (
                                            <div>
                                                {
                                                    this.state.updateMonetization == false ? (
                                                        <div>
                                                            {(checkRights('monetization', 'write') == true) ? (
                                                                <Button className="" color="success" onClick={this.addAppMonetization}>
                                                                    Save Settings
                                                      </Button>
                                                            ) : (null)}
                                                        </div>

                                                    ) : (
                                                            <div>
                                                                {(checkRights('monetization', 'write') == true) ? (
                                                                    <Button className="" color="success" onClick={this.UpdateAppMonetization}>
                                                                        Save Settings
                                                      </Button>
                                                                ) : (null)}
                                                            </div>

                                                        )
                                                }
                                            </div>
                                        ) : (
                                                null
                                            )
                                    }
                                </div>
                            </Col>
                        </Row>

                        {/* Monetization setup */}
                        <Row>
                            <Col xs="12" sm="12">

                                <Card>
                                    <CardHeader>
                                        <strong style={{ color: '#20a8d8', fontSize: '25px' }}>Monetization Setup</strong>
                                    </CardHeader>
                                    <CardBody>

                                        <div>
                                            {/* Facebook ads*/}
                                            < Row >
                                                <Col xs="12" sm="12">
                                                    <Card>
                                                        <CardHeader>
                                                            <Row>
                                                                <Col xs="6">
                                                                    <strong style={{ color: '#20a8d8', fontSize: '20px' }}>FACEBOOK</strong>
                                                                </Col>
                                                                <Col xs="6" style={{ textAlign: 'right' }}>
                                                                    {(checkRights('monetization', 'write') == true) ? (
                                                                        <FormGroup>
                                                                            {/* <Label>
                                                                 <b>Facebook Ads</b>
                                                             </Label> */}
                                                                            <Switch onChange={this.handleChangeFBAds} checked={this.state.fb_ads} />
                                                                        </FormGroup>
                                                                    ) : (null)}

                                                                </Col>
                                                            </Row>
                                                        </CardHeader>
                                                        <CardBody>
                                                            <Row>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="FB_id"><b>FB_id</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="FB_id"
                                                                            name="FB_id"
                                                                            className="form-control"
                                                                            defaultValue={this.state.FB_id}
                                                                            onChange={(e) =>
                                                                                this.state.FB_id = e.target.value
                                                                            }
                                                                            placeholder="Enter FB_id"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="FB_rewareded_ads"><b>FB_rewareded_ads</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="FB_rewareded_ads"
                                                                            name="FB_rewareded_ads"
                                                                            className="form-control"
                                                                            defaultValue={this.state.FB_rewareded_ads}
                                                                            onChange={(e) =>
                                                                                this.state.FB_rewareded_ads = e.target.value
                                                                            }
                                                                            placeholder="Enter FB_rewareded_ads"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="fb_interstitial"><b>FB_interstitial_ads</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="fb_interstitial"
                                                                            name="fb_interstitial"
                                                                            className="form-control"
                                                                            defaultValue={this.state.fb_interstitial}
                                                                            onChange={(e) =>
                                                                                this.state.fb_interstitial = e.target.value
                                                                            }
                                                                            placeholder="Enter FB_interstitial_ads"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="fb_banner"><b>FB_banner_ads</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="fb_banner"
                                                                            name="fb_banner"
                                                                            className="form-control"
                                                                            defaultValue={this.state.fb_banner}
                                                                            onChange={(e) =>
                                                                                this.state.fb_banner = e.target.value
                                                                            }
                                                                            placeholder="Enter FB_banner_ads"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="fb_native_banner"><b>FB_native_banner</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="fb_native_banner"
                                                                            name="fb_native_banner"
                                                                            className="form-control"
                                                                            defaultValue={this.state.fb_native_banner}
                                                                            onChange={(e) =>
                                                                                this.state.fb_native_banner = e.target.value
                                                                            }
                                                                            placeholder="Enter FB_native_banner"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="fb_native"><b>FB_native_ads</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="fb_native"
                                                                            name="fb_native"
                                                                            className="form-control"
                                                                            defaultValue={this.state.fb_native}
                                                                            onChange={(e) =>
                                                                                this.state.fb_native = e.target.value
                                                                            }
                                                                            placeholder="Enter FB_native_ads"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            {/* <Row>
                                                                    <Col xs="6">
                                                                        <FormGroup>
                                                                            <Label>
                                                                                <b>Facebook Ads</b>
                                                                            </Label>
                                                                            <br />
                                                                            <Switch onChange={this.handleChangeFBAds} checked={this.state.fb_ads} />
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Row> */}
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>

                                            {/* Admob ads*/}
                                            <Row>
                                                <Col xs="12" sm="12">
                                                    <Card>
                                                        <CardHeader>
                                                            <Row>
                                                                <Col xs="6">
                                                                    <strong style={{ color: '#20a8d8', fontSize: '20px' }}>GOOGLE</strong>
                                                                </Col>
                                                                <Col xs="6" style={{ textAlign: 'right' }}>
                                                                    {(checkRights('monetization', 'write') == true) ? (
                                                                        <FormGroup>
                                                                            {/* <Label>
                                                                 <b>Facebook Ads</b>
                                                             </Label> */}
                                                                            <Switch onChange={this.handleChangeAdMobAds} checked={this.state.admob_ads} />
                                                                        </FormGroup>
                                                                    ) : (null)}

                                                                </Col>
                                                            </Row>
                                                        </CardHeader>

                                                        <CardBody>
                                                            <Row>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="admob_appid"><b>GAN_id</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="admob_appid"
                                                                            name="admob_appid"
                                                                            className="form-control"
                                                                            defaultValue={this.state.admob_appid}
                                                                            onChange={(e) =>
                                                                                this.state.admob_appid = e.target.value
                                                                            }
                                                                            placeholder="Enter GAN_id"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="admob_interstitial"><b>GAN_interstitial_ads</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="admob_interstitial"
                                                                            name="admob_interstitial"
                                                                            className="form-control"
                                                                            defaultValue={this.state.admob_interstitial}
                                                                            onChange={(e) =>
                                                                                this.state.admob_interstitial = e.target.value
                                                                            }
                                                                            placeholder="Enter GAN_interstitial_ads"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="admob_banner"><b>GAN_banner_ads</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="admob_banner"
                                                                            name="admob_banner"
                                                                            className="form-control"
                                                                            defaultValue={this.state.admob_banner}
                                                                            onChange={(e) =>
                                                                                this.state.admob_banner = e.target.value
                                                                            }
                                                                            placeholder="Enter GAN_banner_ads"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="admob_native_banner"><b>GAN_native_banner</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="admob_native_banner"
                                                                            name="admob_native_banner"
                                                                            className="form-control"
                                                                            defaultValue={this.state.admob_native_banner}
                                                                            onChange={(e) =>
                                                                                this.state.admob_native_banner = e.target.value
                                                                            }
                                                                            placeholder="Enter GAN_native_banner"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="GAN_native_ads"><b>GAN_native_ads </b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="GAN_native_ads"
                                                                            name="GAN_native_ads"
                                                                            className="form-control"
                                                                            defaultValue={this.state.GAN_native_ads}
                                                                            onChange={(e) =>
                                                                                this.state.GAN_native_ads = e.target.value
                                                                            }
                                                                            placeholder="Enter GAN_native_ads "
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="admob_rewarded"><b>GAN_rewareded_ads </b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="admob_rewarded"
                                                                            name="admob_rewarded"
                                                                            className="form-control"
                                                                            defaultValue={this.state.admob_rewarded}
                                                                            onChange={(e) =>
                                                                                this.state.admob_rewarded = e.target.value
                                                                            }
                                                                            placeholder="Enter GAN_rewareded_ads "
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                {/* <Col xs="6">
                                                                        <FormGroup>
                                                                            <Label>
                                                                                <b>AdMob Ads</b>
                                                                            </Label>
                                                                            <br />
                                                                            <Switch onChange={this.handleChangeAdMobAds} checked={this.state.admob_ads} />
                                                                        </FormGroup>
                                                                    </Col> */}
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>

                                            {/* Mopub ads*/}
                                            <Row>
                                                <Col xs="12" sm="12">
                                                    <Card>
                                                        <CardHeader>
                                                            <Row>
                                                                <Col xs="6">
                                                                    <strong style={{ color: '#20a8d8', fontSize: '20px' }}>MOPUB</strong>
                                                                </Col>
                                                                <Col xs="6" style={{ textAlign: 'right' }}>
                                                                    {(checkRights('monetization', 'write') == true) ? (
                                                                        <FormGroup>
                                                                            {/* <Label>
                                                                <b>Facebook Ads</b>
                                                            </Label> */}
                                                                            <Switch onChange={this.handleChangeMopubAds} checked={this.state.mopub_ads} />
                                                                        </FormGroup>
                                                                    ) : (null)}

                                                                </Col>
                                                            </Row>
                                                        </CardHeader>

                                                        <CardBody>
                                                            <Row>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="MO_id"><b>MO_id</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="MO_id"
                                                                            name="MO_id"
                                                                            className="form-control"
                                                                            defaultValue={this.state.MO_id}
                                                                            onChange={(e) =>
                                                                                this.state.MO_id = e.target.value
                                                                            }
                                                                            placeholder="Enter MO_id"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="mopub_interstitial"><b>MO_interstitial_ads</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="mopub_interstitial"
                                                                            name="mopub_interstitial"
                                                                            className="form-control"
                                                                            defaultValue={this.state.mopub_interstitial}
                                                                            onChange={(e) =>
                                                                                this.state.mopub_interstitial = e.target.value
                                                                            }
                                                                            placeholder="Enter MO_interstitial_ads"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="mopub_native_banner"><b>MO_native_banner</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="mopub_native_banner"
                                                                            name="mopub_native_banner"
                                                                            className="form-control"
                                                                            defaultValue={this.state.mopub_native_banner}
                                                                            onChange={(e) =>
                                                                                this.state.mopub_native_banner = e.target.value
                                                                            }
                                                                            placeholder="Enter MO_native_banner"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="mopub_video"><b>MO_native_ads</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="mopub_video"
                                                                            name="mopub_video"
                                                                            className="form-control"
                                                                            defaultValue={this.state.mopub_video}
                                                                            onChange={(e) =>
                                                                                this.state.mopub_video = e.target.value
                                                                            }
                                                                            placeholder="Enter MO_native_ads"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="mopub_banner"><b>MO_banner_ads</b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="mopub_banner"
                                                                            name="mopub_banner"
                                                                            className="form-control"
                                                                            defaultValue={this.state.mopub_banner}
                                                                            onChange={(e) =>
                                                                                this.state.mopub_banner = e.target.value
                                                                            }
                                                                            placeholder="Enter MO_banner_ads"
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>

                                                                <Col xs="6">
                                                                    <FormGroup>
                                                                        <Label htmlFor="mopub_reward_video"><b>MO_rewareded_ads </b></Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="mopub_reward_video"
                                                                            name="mopub_reward_video"
                                                                            className="form-control"
                                                                            defaultValue={this.state.mopub_reward_video}
                                                                            onChange={(e) =>
                                                                                this.state.mopub_reward_video = e.target.value
                                                                            }
                                                                            placeholder="Enter MO_rewareded_ads "
                                                                            required
                                                                        />
                                                                    </FormGroup>
                                                                </Col>
                                                                {/* <Col xs="6">
                                                                        <FormGroup>
                                                                            <Label>
                                                                                <b>Mopub Ads</b>
                                                                            </Label>
                                                                            <br />
                                                                            <Switch onChange={this.handleChangeMopubAds} checked={this.state.mopub_ads} />
                                                                        </FormGroup>
                                                                    </Col> */}
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                ) : (null)}
            </div >
        );
    }
}

export default MonetizationNetwork;