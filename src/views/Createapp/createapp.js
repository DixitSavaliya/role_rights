import React, { Fragment } from 'react';
import Switch from "react-switch";
import { EventEmitter } from '../../event';
import './createaoo.css';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import checkRights from '../../rights';
import { REMOTE_URL } from '../../redux/constants/index';
import axios from 'axios';
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

class CreateApp extends React.Component {

    /** First Constructor Call */
    constructor(props) {
        super(props);
        this.state = {
            statuscheck1: true,
            is_featuresstatuscheck1: true,
            webviewstatuscheck1: true,
            exitstatuscheck1: true,
            statuscheck2: false,
            name: '',
            nameerror: '',
            description: '',
            descriptionerror: '',
            package: '',
            packageerrror: '',
            icon: '',
            iconerror: '',
            link: '',
            linkerror: '',
            data: '',
            dataerror: '',
            privacy: '',
            privacyerror: '',
            more_apps: '',
            more_appserror: '',
            version_code: '',
            version_codeerror: '',
            serverKey: '',
            serverKeyerror: '',
            is_features: 1,
            is_featureserror: '',
            type: '',
            typeerror: '',
            customSelect: '',
            customSelecterror: '',
            is_live: '',
            is_liveerror: '',
            status: 1,
            statuserror: '',
            webviewstatus: 1,
            webviewstatuserror: '',
            exitstatus: 1,
            exitstatuserror: '',
            selectedFile: null,
            selectedFileerror: '',
            bannerselectedFile: null,
            bannerselectedFileerror: '',
            checked: false,
            is_live: 0,
            customSelectName: '',
            app_id: '',
            updateRightBtn: false,
            App: [],
            filename: '',
            bannerfilename: '',
            flag: 1,
            rightdata: ''
        }
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onURLHandler = this.onURLHandler.bind(this);
        this.onHandler = this.onHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.CreateApp = this.CreateApp.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
        this.handleChangeEvent = this.handleChangeEvent.bind(this);
        this.EditApp = this.EditApp.bind(this);
        this.handleChangeIsFeaturesStatus = this.handleChangeIsFeaturesStatus.bind(this);
        this.handleChangeWebViewStatus = this.handleChangeWebViewStatus.bind(this);
        this.handleChangeExitStatus = this.handleChangeExitStatus.bind(this);
        this.removeIconPath = this.removeIconPath.bind(this);

    }

    componentDidUpdate() {
        if (this.state.flag == 0) {
            this.setState({
                rightdata: this.state.rightdata = JSON.parse(Auth.getRight()),
                flag: this.state.flag = 1
            })
        }
    }

    handleChangeIsFeaturesStatus(event) {
        this.setState({
            is_featuresstatuscheck1: this.state.is_featuresstatuscheck1 = event.target.checked,
            is_features: this.state.is_features = event.target.defaultValue
        })
    }

    handleChangeWebViewStatus(event) {
        this.setState({
            webviewstatuscheck1: this.state.webviewstatuscheck1 = event.target.checked,
            webviewstatus: this.state.webviewstatus = event.target.defaultValue
        })
    }

    handleChangeExitStatus(event) {
        this.setState({
            exitstatuscheck1: this.state.exitstatuscheck1 = event.target.checked,
            exitstatus: this.state.exitstatus = event.target.defaultValue
        })
    }

    handleChangeEvent(event) {
        this.setState({
            nameerror: this.state.nameerror = '',
            descriptionerror: this.state.descriptionerror = '',
            packageerrror: this.state.packageerrror = '',
            customSelecterror: this.state.customSelecterror = '',
            statuserror: this.state.statuserror = '',
            selectedFileerror: this.state.selectedFileerror = '',
        })
        event.preventDefault();
        const state = this.state
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    validate1() {
        let nameerror = "";
        let descriptionerror = "";
        let packageerrror = "";
        let selectedFileerror = "";
        let customSelecterror = "";
        // let bannerselectedFileerror = "";
        // let linkerror = "";
        // let dataerror = "";
        // let privacyerror = "";

        if (!this.state.name) {
            nameerror = "please enter appname";
        }

        // if (!this.state.link) {
        //     linkerror = "please enter URL";
        // }

        // if (!this.state.data) {
        //     dataerror = "please enter data";
        // }

        // if (!this.state.privacy) {
        //     privacyerror = "please enter privacy policy";
        // }

        if (!this.state.description) {
            descriptionerror = "please enter description";
        }

        if (!this.state.package) {
            packageerrror = "please enter package";
        }

        if (!this.state.selectedFile) {
            selectedFileerror = "please select file";
        }

        // if (!this.state.bannerselectedFile) {
        //     bannerselectedFileerror = "please select file";
        // }

        if (!this.state.customSelect) {
            customSelecterror = "please select type";
        }


        if (nameerror || descriptionerror || packageerrror || selectedFileerror || customSelecterror) {
            this.setState({ nameerror, descriptionerror, packageerrror, selectedFileerror, customSelecterror });
            return false;
        }
        return true;
    };

    validate() {
        let nameerror = "";
        let descriptionerror = "";
        let packageerrror = "";
        let selectedFileerror = "";
        // let statuserror = "";
        let customSelecterror = "";
        // let bannerselectedFileerror = "";
        // let more_appserror = "";
        // let version_codeerror = "";
        // let linkerror = "";
        // let dataerror = "";
        // let privacyerror = "";
        // let serverKeyerror = ""

        if (!this.state.name) {
            nameerror = "please enter appname";
        }

        // if (!this.state.more_apps) {
        //     more_appserror = "please enter moreapps";
        // }

        // if (!this.state.serverKey) {
        //     serverKeyerror = "please enter server key";
        // }

        // if (!this.state.link) {
        //     linkerror = "please enter URL";
        // }

        // if (!this.state.data) {
        //     dataerror = "please enter data";
        // }

        // if (!this.state.privacy) {
        //     privacyerror = "please enter privacy policy";
        // }

        // if (!this.state.version_code) {
        //     version_codeerror = "please enter versioncode";
        // }

        if (!this.state.description) {
            descriptionerror = "please enter description";
        }

        if (!this.state.package) {
            packageerrror = "please enter package";
        }

        if (!this.state.selectedFile) {
            selectedFileerror = "please select file";
        }

        // if (!this.state.bannerselectedFile) {
        //     bannerselectedFileerror = "please select file";
        // }

        if (!this.state.customSelect) {
            customSelecterror = "please select type";
        }


        if (nameerror || descriptionerror || packageerrror || selectedFileerror || customSelecterror) {
            this.setState({ nameerror, descriptionerror, packageerrror, selectedFileerror, customSelecterror });
            return false;
        }
        return true;
    };

    componentDidMount() {
        EventEmitter.subscribe('updated_rights', (value) => {
            this.setState({ flag: this.state.flag = 0 });
        });
        if (this.props.id) {
            const obj = {
                application_id: this.props.id,
                user_id: this.props.auth.auth_data.id,
                user_group: this.props.auth.auth_data.user_group
            }
            this.props.getAppDataById(obj).then((res) => {

                this.setState({
                    App: this.state.App = res.response.data
                })
                if (this.state.App.is_live == 1) {
                    this.setState({
                        updateRightBtn: this.state.updateRightBtn = true,
                        app_id: this.state.App.id,
                        name: this.state.App.name,
                        description: this.state.App.description,
                        link: this.state.App.link,
                        package: this.state.App.package,
                        selectedFile: this.state.App.icon,
                        bannerselectedFile: this.state.App.banner,
                        data: this.state.App.data,
                        web_view: this.state.App.web_view,
                        webviewstatuscheck1: this.state.webviewstatuscheck1 = (this.state.App.web_view == 1) ? true : false,
                        exitstatuscheck1: this.state.exitstatuscheck1 = (this.state.App.exit_status == 1) ? true : false,
                        is_featuresstatuscheck1: this.state.is_featuresstatuscheck1 = (this.state.App.is_features == 1) ? true : false,
                        privacy: this.state.App.privacy,
                        customSelect: this.state.App.type,
                        is_live: this.state.App.is_live,
                        checked: this.state.checked = true,
                        status: this.state.status = 1,
                        statuscheck1: this.state.statuscheck1 = (this.state.App.status == 1) ? true : false,
                        more_apps: this.state.App.more_apps,
                        version_code: this.state.App.version_code,
                        serverKey: this.state.App.serverKey
                    })
                } else {
                    this.setState({
                        updateRightBtn: this.state.updateRightBtn = true,
                        app_id: this.state.App.id,
                        name: this.state.App.name,
                        description: this.state.App.description,
                        link: this.state.App.link,
                        package: this.state.App.package,
                        selectedFile: this.state.App.icon,
                        bannerselectedFile: this.state.App.banner,
                        data: this.state.App.data,
                        web_view: this.state.App.web_view,
                        webviewstatuscheck1: this.state.webviewstatuscheck1 = (this.state.App.web_view == 1) ? true : false,
                        exitstatuscheck1: this.state.exitstatuscheck1 = (this.state.App.exit_status == 1) ? true : false,
                        is_featuresstatuscheck1: this.state.is_featuresstatuscheck1 = (this.state.App.is_features == 1) ? true : false,
                        privacy: this.state.App.privacy,
                        customSelect: this.state.App.type,
                        is_live: this.state.App.is_live,
                        checked: this.state.checked = false,
                        status: this.state.status = 1,
                        statuscheck1: this.state.statuscheck1 = (this.state.App.status == 1) ? true : false,
                        more_apps: this.state.App.more_apps,
                        version_code: this.state.App.version_code,
                        serverKey: this.state.App.serverKey
                    })

                }
            })
        }

        if (this.props.auth.auth_data.user_group == "publisher") {
            this.setState({
                is_features: this.state.is_features = "",
                more_apps: this.state.more_apps,
                version_code: this.state.version_code,
                exitstatus: this.state.exitstatus = 1
            })
        } else {
            this.setState({
                is_features: this.state.is_features = 1,
                more_apps: this.state.more_apps = "",
                version_code: this.state.version_code = "",
                exitstatus: this.state.exitstatus = ""
            })
        }
    }

    handleChange(checkedvalue) {
        this.setState({
            checked: this.state.checked = checkedvalue
        })
        if (this.state.checked == false) {
            this.setState({
                is_live: this.state.is_live = 0
            })
        } else {
            this.setState({
                is_live: this.state.is_live = 1
            })
        }
    }

    onChangeHandler(event) {
        let auth = this.props.auth.auth_data;
        axios.defaults.headers.post['Authorization'] = 'Barier ' + (auth ? auth.access_token : '');
        axios.defaults.headers.post['content-md5'] = auth ? auth.secret_key : '';

        let data = new FormData();
        data.append('file_name', event.target.files[0]);
        data.append('user_id', this.props.auth.auth_data.id)
        axios.post(REMOTE_URL + "Application/uploadApplicationIcon", data)
            .then(response => {
                this.setState({
                    selectedFile: this.state.selectedFile = response.data.data
                })
            }).catch(error => {
                console.log("error", error);
            });
    }

    onHandler(event) {
        let auth = this.props.auth.auth_data;
        axios.defaults.headers.post['Authorization'] = 'Barier ' + (auth ? auth.access_token : '');
        axios.defaults.headers.post['content-md5'] = auth ? auth.secret_key : '';

        let data = new FormData();
        data.append('file_name', event.target.files[0]);
        data.append('user_id', this.props.auth.auth_data.id)
        axios.post(REMOTE_URL + "Application/uploadApplicationIcon", data)
            .then(response => {
                this.setState({
                    bannerselectedFile: this.state.bannerselectedFile = response.data.data
                })
            }).catch(error => {
                console.log("error", error);
            });
    }

    onURLChangeHandler(event) {
        let auth = this.props.auth.auth_data;
        axios.defaults.headers.post['Authorization'] = 'Barier ' + (auth ? auth.access_token : '');
        axios.defaults.headers.post['content-md5'] = auth ? auth.secret_key : '';
        let _this = this;
        let data = {
            data: {
                module_name: 'Application',
                primary_id: "",
            },
            imageURL: this.state.filename
        }

        if (data.imageURL) {
            axios.post(REMOTE_URL + "AP/uploadImageByURL", data)
                .then(response => {
                    if (response.data.status == 1) {
                        Swal.fire({
                            text: response.data.message,
                            icon: 'success'
                        });
                        this.setState({
                            selectedFile: this.state.selectedFile = response.data.data
                        })
                    } else {
                        Swal.fire({
                            text: response.data.message,
                            icon: 'warning'
                        });
                    }
                    // _this.props.updateProfileData().then((res) =>{
                    // })
                }).catch(error => {
                    console.log("error", error);
                });
        } else {
            Swal.fire("PLease Enter URL!", "", "warning");
        }
    }

    onURLHandler(event) {
        let auth = this.props.auth.auth_data;
        axios.defaults.headers.post['Authorization'] = 'Barier ' + (auth ? auth.access_token : '');
        axios.defaults.headers.post['content-md5'] = auth ? auth.secret_key : '';
        let _this = this;
        let data = {
            data: {
                module_name: 'Application',
                primary_id: "",
            },
            imageURL: this.state.bannerfilename
        }

        if (data.imageURL) {
            axios.post(REMOTE_URL + "AP/uploadImageByURL", data)
                .then(response => {
                    if (response.data.status == 1) {
                        Swal.fire({
                            text: response.data.message,
                            icon: 'success'
                        });
                        this.setState({
                            bannerselectedFile: this.state.bannerselectedFile = response.data.data
                        })
                    } else {
                        Swal.fire({
                            text: response.data.message,
                            icon: 'warning'
                        });
                    }
                    // _this.props.updateProfileData().then((res) =>{
                    // })
                }).catch(error => {
                    console.log("error", error);
                });
        } else {
            Swal.fire("PLease Enter URL!", "", "warning");
        }
    }


    handleChangeStatus(event) {
        this.setState({
            statuscheck1: this.state.statuscheck1 = event.target.checked,
            status: this.state.status = event.target.defaultValue
        })
    }

    onItemSelect(event) {

        let _id = event.target.options[event.target.selectedIndex].value;
        let _name = event.target.options[event.target.selectedIndex].innerHTML;
        this.setState({
            customSelect: this.state.customSelect = _id,
            customSelectName: this.state.customSelectName = _name
        })
    }

    removeIcon(data) {
        const obj = {
            id: this.props.auth.auth_data.id,
            image_path: data
        }
        this.props.removeImage(obj).then((res) => {
            if (res.response.status == 1) {
                Swal.fire({
                    text: res.response.message,
                    icon: 'success'
                });

                this.setState({
                    selectedFile: this.state.selectedFile = null
                })

            } else {
                Swal.fire({
                    text: res.response.message,
                    icon: 'warning'
                });
            }
        })
    }

    removeIconPath(data) {
        const obj = {
            id: this.props.auth.auth_data.id,
            image_path: data
        }
        this.props.removeImage(obj).then((res) => {
            if (res.response.status == 1) {
                Swal.fire({
                    text: res.response.message,
                    icon: 'success'
                });

                this.setState({
                    bannerselectedFile: this.state.bannerselectedFile = null
                })

            } else {
                Swal.fire({
                    text: res.response.message,
                    icon: 'warning'
                });
            }
        })
    }


    CreateApp() {
        if (this.props.auth.auth_data.user_group == "publisher") {
            const isValid = this.validate();
            if (isValid) {
                this.setState({
                    nameerror: '',
                    descriptionerror: '',
                    packageerrror: '',
                    customSelecterror: '',
                    selectedFileerror: '',
                    // bannerselectedFileerror: '',
                    // linkerror: '',
                    // dataerror: '',
                    // privacyerror: '',
                    // more_appserror: '',
                    // version_codeerror: '',
                    // serverKeyerror: ''
                })

                if (this.state.name && this.state.description && this.state.package && this.state.selectedFile && this.state.customSelect) {
                    const obj = {
                        name: this.state.name,
                        status: this.state.status,
                        description: this.state.description,
                        package: this.state.package,
                        icon: this.state.selectedFile,
                        type: this.state.customSelect,
                        is_live: this.state.is_live,
                        user_id: this.props.auth.auth_data.id,
                        user_group: this.props.auth.auth_data.user_group,
                        banner: this.state.bannerselectedFile,
                        link: this.state.link,
                        data: this.state.data,
                        web_view: this.state.webviewstatus,
                        privacy: this.state.privacy,
                        other: {
                            is_features: this.state.is_features,
                            more_apps: this.state.more_apps,
                            version_code: this.state.version_code,
                            exit_status: this.state.exitstatus,
                            serverKey: this.state.serverKey
                        }
                    }

                    this.props.createApp(obj).then((res) => {
                        if (res.response.status == 1) {
                            Swal.fire({
                                text: res.response.message,
                                icon: 'success'
                            });
                            this.props.history.push(this.props.from || { pathname: '/listapp' });
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
        } else {
            const isValid = this.validate1();
            if (isValid) {
                this.setState({
                    nameerror: '',
                    descriptionerror: '',
                    packageerrror: '',
                    customSelecterror: '',
                    selectedFileerror: '',
                    // bannerselectedFileerror: '',
                    // linkerror: '',
                    // dataerror: '',
                    // privacyerror: ''
                })

                if (this.state.name && this.state.description && this.state.package && this.state.selectedFile && this.state.customSelect) {
                    const obj = {
                        name: this.state.name,
                        status: this.state.status,
                        description: this.state.description.replace(/\\\//g, "/"),
                        package: this.state.package,
                        icon: this.state.selectedFile,
                        type: this.state.customSelect,
                        is_live: this.state.is_live,
                        user_id: this.props.auth.auth_data.id,
                        user_group: this.props.auth.auth_data.user_group,
                        banner: this.state.bannerselectedFile,
                        link: this.state.link,
                        data: this.state.data,
                        web_view: this.state.webviewstatus,
                        privacy: this.state.privacy,
                        other: {
                            is_features: this.state.is_features,
                            more_apps: this.state.more_apps,
                            version_code: this.state.version_code,
                            exit_status: this.state.exitstatus,
                            serverKey: this.state.serverKey
                        }
                    }

                    this.props.createApp(obj).then((res) => {
                        if (res.response.status == 1) {
                            Swal.fire({
                                text: res.response.message,
                                icon: 'success'
                            });
                            this.props.history.push(this.props.from || { pathname: '/listapp' });
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
    }

    EditApp() {
        if (this.props.auth.auth_data.user_group == "publisher") {
            const isValid = this.validate();
            if (isValid) {
                this.setState({
                    nameerror: '',
                    descriptionerror: '',
                    packageerrror: '',
                    customSelecterror: '',
                    selectedFileerror: '',
                    // bannerselectedFileerror: '',
                    // linkerror: '',
                    // dataerror: '',
                    // privacyerror: '',
                    // more_appserror: '',
                    // version_codeerror: '',
                    // serverKeyerror: ''
                })
                if (this.state.name && this.state.description && this.state.package && this.state.selectedFile && this.state.customSelect) {
                    const obj = {
                        id: this.state.app_id,
                        name: this.state.name,
                        status: this.state.status,
                        description: this.state.description.replace(/\\\//g, "/"),
                        package: this.state.package,
                        icon: this.state.selectedFile,
                        type: this.state.customSelect,
                        is_live: this.state.is_live,
                        user_id: this.props.auth.auth_data.id,
                        user_group: this.props.auth.auth_data.user_group,
                        banner: this.state.bannerselectedFile,
                        link: this.state.link,
                        data: this.state.data,
                        web_view: this.state.webviewstatus,
                        privacy: this.state.privacy,
                        other: {
                            is_features: this.state.is_features,
                            more_apps: this.state.more_apps,
                            version_code: this.state.version_code,
                            exit_status: this.state.exitstatus,
                            serverKey: this.state.serverKey
                        }
                    }
                    this.props.editApp(obj).then((res) => {
                        if (res.response.status == 1) {
                            Swal.fire({
                                text: res.response.message,
                                icon: 'success'
                            });
                            this.props.history.push(this.props.from || { pathname: '/listapp' });
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
        } else {
            const isValid = this.validate1();
            if (isValid) {
                this.setState({
                    nameerror: '',
                    descriptionerror: '',
                    packageerrror: '',
                    customSelecterror: '',
                    selectedFileerror: '',
                    // bannerselectedFileerror: '',
                    // linkerror: '',
                    // dataerror: '',
                    // privacyerror: ''
                })
                if (this.state.name && this.state.description && this.state.package && this.state.selectedFile && this.state.customSelect) {
                    const obj = {
                        id: this.state.app_id,
                        name: this.state.name,
                        status: this.state.status,
                        description: this.state.description.replace(/\\\//g, "/"),
                        package: this.state.package,
                        icon: this.state.selectedFile,
                        type: this.state.customSelect,
                        is_live: this.state.is_live,
                        user_id: this.props.auth.auth_data.id,
                        user_group: this.props.auth.auth_data.user_group,
                        banner: this.state.bannerselectedFile,
                        link: this.state.link,
                        data: this.state.data,
                        web_view: this.state.webviewstatus,
                        privacy: this.state.privacy,
                        other: {
                            is_features: this.state.is_features,
                            more_apps: this.state.more_apps,
                            version_code: this.state.version_code,
                            exit_status: this.state.exitstatus,
                            serverKey: this.state.serverKey
                        }
                    }
                    this.props.editApp(obj).then((res) => {
                        if (res.response.status == 1) {
                            Swal.fire({
                                text: res.response.message,
                                icon: 'success'
                            });
                            this.props.history.push(this.props.from || { pathname: '/listapp' });
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
    }

    render() {
        const { auth } = this.props;
        return (
            <div className="animated fadeIn">
                {(checkRights('application', 'read') == true) ? (
                    <div>
                        <Row>
                            <Col xs="4" sm="4" md="4" lg="4" xl="4">
                                {
                                    this.props.id ? (
                                        <div>
                                            <Link to="/ListApp"><Button className="mb-2 mr-2" color="primary">
                                                Go back
                                </Button></Link>
                                            {
                                                this.props.id ? (
                                                    (checkRights('application', 'write') == true) ? (

                                                        <Button
                                                            color="primary"
                                                            className="mb-2 mr-2"
                                                            onClick={this.EditApp}
                                                        >
                                                            Update
                                        </Button>
                                                    ) : (
                                                            null
                                                        )
                                                ) : (
                                                        (checkRights('application', 'write') == true) ? (

                                                            <Button
                                                                color="primary"
                                                                className="mb-2 mr-2"
                                                                onClick={this.CreateApp}
                                                            >
                                                                Create
                                        </Button>
                                                        ) : (
                                                                null
                                                            )
                                                    )
                                            }
                                        </div>
                                    ) : (
                                            (checkRights('application', 'write') == true) ? (
                                                <Button
                                                    color="primary"
                                                    className="mb-2 mr-2"
                                                    onClick={this.CreateApp}
                                                >
                                                    Create
                        </Button>
                                            ) : (
                                                    null
                                                )
                                        )
                                }
                            </Col>

                        </Row>
                        <Row>
                            <Col xs="12" sm="12" md="12" lg="12" xl="12">
                                <Card>
                                    <CardHeader>
                                        <strong>CreateApp</strong>
                                    </CardHeader>
                                    <CardBody>
                                        {
                                            this.props.auth.auth_data.user_group == "publisher" ? (
                                                //Publisher App
                                                <div>
                                                    <Row>
                                                        <Col xs="6">
                                                            <FormGroup>
                                                                <Label htmlFor="name"><b>Name:</b></Label>
                                                                <Input
                                                                    type="text"
                                                                    id="name"
                                                                    name="name"
                                                                    className="form-control"
                                                                    defaultValue={this.state.name}
                                                                    onChange={this.handleChangeEvent}
                                                                    placeholder="Enter your appname"
                                                                    required
                                                                />
                                                                <div style={{ fontSize: 12, color: "red" }}>
                                                                    {this.state.nameerror}
                                                                </div>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col xs="6">
                                                            <FormGroup>
                                                                <Label htmlFor="package"><b>Package:</b></Label>
                                                                <Input
                                                                    type="text"
                                                                    id="package"
                                                                    name="package"
                                                                    className="form-control"
                                                                    defaultValue={this.state.package}
                                                                    onChange={this.handleChangeEvent}
                                                                    placeholder="Enter your package"
                                                                    required
                                                                />
                                                                <div style={{ fontSize: 12, color: "red" }}>
                                                                    {this.state.packageerrror}
                                                                </div>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="6">
                                                            <FormGroup>
                                                                <Label htmlFor="privacy"><b>Privacy Policy:</b></Label>
                                                                <Input
                                                                    type="text"
                                                                    id="privacy"
                                                                    name="privacy"
                                                                    className="form-control"
                                                                    defaultValue={this.state.privacy}
                                                                    onChange={this.handleChangeEvent}
                                                                    rows="4"
                                                                    placeholder="Enter privacy policy content..."
                                                                    required
                                                                />
                                                                {/* <div style={{ fontSize: 12, color: "red" }}>
                                                            {this.state.privacyerror}
                                                        </div> */}
                                                            </FormGroup>
                                                        </Col>


                                                        <Col xs="6">
                                                            {
                                                                this.props.id ? (
                                                                    <FormGroup>
                                                                        <Label for="exampleCustomSelect"><b>Select Type:</b></Label>
                                                                        <Input
                                                                            type="select"
                                                                            className="form-control"
                                                                            id="exampleCustomSelect"
                                                                            name="customSelect"
                                                                            onChange={this.onItemSelect}
                                                                        >
                                                                            <option value="">{this.state.App.type == 1 ? 'Android' : (this.state.App.type == 2 ? 'IOS' : (this.state.App.type == 3 ? 'Web' : null))}</option>
                                                                            <option value="1">Android</option>
                                                                            <option value="2">IOS</option>
                                                                            <option value="3">Web</option>

                                                                        </Input>
                                                                        <div style={{ fontSize: 12, color: "red" }}>
                                                                            {this.state.customSelecterror}
                                                                        </div>
                                                                    </FormGroup>
                                                                ) : (

                                                                        <FormGroup>
                                                                            <Label for="exampleCustomSelect"><b>Select Type:</b></Label>
                                                                            <Input
                                                                                type="select"
                                                                                className="form-control"
                                                                                id="exampleCustomSelect"
                                                                                name="customSelect"
                                                                                onChange={this.onItemSelect}
                                                                            >
                                                                                <option value="">Select Type:</option>
                                                                                <option value="1">Android</option>
                                                                                <option value="2">IOS</option>
                                                                                <option value="3">Web</option>

                                                                            </Input>
                                                                            <div style={{ fontSize: 12, color: "red" }}>
                                                                                {this.state.customSelecterror}
                                                                            </div>
                                                                        </FormGroup>
                                                                    )
                                                            }
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="6">
                                                            <FormGroup>
                                                                <Label htmlFor="Versioncode"><b>Versioncode:</b></Label>
                                                                <Input
                                                                    type="text"
                                                                    id="Versioncode"
                                                                    name="version_code"
                                                                    className="form-control"
                                                                    defaultValue={this.state.version_code}
                                                                    onChange={this.handleChangeEvent}
                                                                    placeholder="Enter Version Code"
                                                                    required
                                                                />
                                                                {/* <div style={{ fontSize: 12, color: "red" }}>
                                                            {this.state.version_codeerror}
                                                        </div> */}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col xs="6">
                                                            <FormGroup>
                                                                <Label htmlFor="Link"><b>Link:</b></Label>
                                                                <Input
                                                                    type="text"
                                                                    id="Link"
                                                                    name="link"
                                                                    className="form-control"
                                                                    defaultValue={this.state.link}
                                                                    onChange={this.handleChangeEvent}
                                                                    placeholder="Enter URL"
                                                                    required
                                                                />
                                                                {/* <div style={{ fontSize: 12, color: "red" }}>
                                                            {this.state.linkerror}
                                                        </div> */}
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="6">
                                                            <FormGroup>
                                                                <Label htmlFor="more_apps"><b>More apps:</b></Label>
                                                                <Input
                                                                    type="text"
                                                                    id="more_apps"
                                                                    name="more_apps"
                                                                    className="form-control"
                                                                    defaultValue={this.state.more_apps}
                                                                    onChange={this.handleChangeEvent}
                                                                    placeholder="Enter More Apps"
                                                                    required
                                                                />
                                                                {/* <div style={{ fontSize: 12, color: "red" }}>
                                                            {this.state.more_appserror}
                                                        </div> */}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col xs="6">
                                                            <FormGroup>
                                                                <Label htmlFor="Data"><b>Data:</b></Label>
                                                                <Input
                                                                    type="text"
                                                                    id="Data"
                                                                    name="data"
                                                                    className="form-control"
                                                                    defaultValue={this.state.data}
                                                                    onChange={this.handleChangeEvent}
                                                                    placeholder="Enter your data"
                                                                    required
                                                                />
                                                                {/* <div style={{ fontSize: 12, color: "red" }}>
                                                            {this.state.dataerror}
                                                        </div> */}
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs="12">
                                                            <FormGroup>
                                                                <Label htmlFor="ServerKey"><b>ServerKey:</b></Label>
                                                                <Input
                                                                    type="text"
                                                                    id="ServerKey"
                                                                    name="serverKey"
                                                                    className="form-control"
                                                                    defaultValue={this.state.serverKey}
                                                                    onChange={this.handleChangeEvent}
                                                                    placeholder="Enter ServerKey"
                                                                    required
                                                                />
                                                                {/* <div style={{ fontSize: 12, color: "red" }}>
                                                                {this.state.serverKeyerror}
                                                            </div> */}
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="12">
                                                            <FormGroup>
                                                                <Label htmlFor="description"><b>Description:</b></Label>
                                                                <Input
                                                                    type="textarea"
                                                                    id="description"
                                                                    name="description"
                                                                    className="form-control"
                                                                    defaultValue={this.state.description}
                                                                    onChange={this.handleChangeEvent}
                                                                    rows="4"
                                                                    placeholder="Content..."
                                                                    required
                                                                />
                                                                <div style={{ fontSize: 12, color: "red" }}>
                                                                    {this.state.descriptionerror}
                                                                </div>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs="3">
                                                            <Label htmlFor="userrole"><b>Status:</b></Label>
                                                            <br />
                                                            <FormGroup check inline>
                                                                <Input
                                                                    type="radio"
                                                                    id="inline-radio36"
                                                                    defaultValue="1"
                                                                    checked={this.state.status == 1 ? this.state.statuscheck1 : !this.state.statuscheck1}
                                                                    name="status"
                                                                    onChange={this.handleChangeStatus}
                                                                />
                                                                <Label
                                                                    className="form-check-label"
                                                                    check htmlFor="inline-radio36"
                                                                >
                                                                    Active
                                                 </Label>

                                                            </FormGroup>
                                                            <FormGroup check inline>
                                                                <Input
                                                                    type="radio"
                                                                    id="inline-radio65"
                                                                    defaultValue="0"
                                                                    checked={this.state.status == 0 ? this.state.statuscheck1 : !this.state.statuscheck1}
                                                                    name="status"
                                                                    onChange={this.handleChangeStatus}
                                                                />

                                                                <Label
                                                                    className="form-check-label"
                                                                    check htmlFor="inline-radio65"
                                                                >
                                                                    InActive
                                                 </Label>

                                                            </FormGroup>
                                                            <div style={{ fontSize: 12, color: "red" }}>
                                                                {this.state.statuserror}
                                                            </div>
                                                        </Col>

                                                        <Col xs="3">
                                                            <Label htmlFor="inline-radio78"><b>WebView:</b></Label>
                                                            <br />
                                                            <FormGroup check inline>
                                                                <Input
                                                                    type="radio"
                                                                    id="inline-radio789"
                                                                    defaultValue="1"
                                                                    checked={this.state.webviewstatus == 1 ? this.state.webviewstatuscheck1 : !this.state.webviewstatuscheck1}
                                                                    name="WebView"
                                                                    onChange={this.handleChangeWebViewStatus}
                                                                />
                                                                <Label
                                                                    className="form-check-label"
                                                                    check htmlFor="inline-radio789"
                                                                >
                                                                    Yes
                                                 </Label>

                                                            </FormGroup>
                                                            <FormGroup check inline>
                                                                <Input
                                                                    type="radio"
                                                                    id="inline-radio498"
                                                                    defaultValue="0"
                                                                    checked={this.state.webviewstatus == 0 ? this.state.webviewstatuscheck1 : !this.state.webviewstatuscheck1}
                                                                    name="WebView"
                                                                    onChange={this.handleChangeWebViewStatus}
                                                                />

                                                                <Label
                                                                    className="form-check-label"
                                                                    check htmlFor="inline-radio498"
                                                                >
                                                                    No
                                                 </Label>

                                                            </FormGroup>
                                                            {/* <div style={{ fontSize: 12, color: "red" }}>
                                                        {this.state.webviewstatuserror}
                                                    </div> */}
                                                        </Col>

                                                        <Col xs="3">
                                                            <Label htmlFor="userrole"><b>ExitStatus:</b></Label>
                                                            <br />
                                                            <FormGroup check inline>
                                                                <Input
                                                                    type="radio"
                                                                    id="inline-radio188"
                                                                    defaultValue="1"
                                                                    checked={this.state.exitstatus == 1 ? this.state.exitstatuscheck1 : !this.state.exitstatuscheck1}
                                                                    name="ExitStatus"
                                                                    onChange={this.handleChangeExitStatus}
                                                                />
                                                                <Label
                                                                    className="form-check-label"
                                                                    check htmlFor="inline-radio188"
                                                                >
                                                                    Yes
                                                 </Label>

                                                            </FormGroup>
                                                            <FormGroup check inline>
                                                                <Input

                                                                    type="radio"
                                                                    id="inline-radio288"
                                                                    defaultValue="0"
                                                                    checked={this.state.exitstatus == 0 ? this.state.exitstatuscheck1 : !this.state.exitstatuscheck1}
                                                                    name="ExitStatus"
                                                                    onChange={this.handleChangeExitStatus}
                                                                />

                                                                <Label
                                                                    className="form-check-label"
                                                                    check htmlFor="inline-radio288"
                                                                >
                                                                    No
                                                 </Label>

                                                            </FormGroup>
                                                            {/* <div style={{ fontSize: 12, color: "red" }}>
                                                        {this.state.exitstatuserror}
                                                    </div> */}
                                                        </Col>
                                                        {(checkRights('application', 'write') == true) ? (
                                                            <Col xs="3">
                                                                <Label>
                                                                    <b>IsLive:</b>
                                                                </Label>
                                                                <br />
                                                                <Switch onChange={this.handleChange} checked={this.state.checked} />
                                                            </Col>
                                                        ) : (null)}

                                                    </Row>
                                                    <Row>
                                                        <Col xs="6">
                                                            <FormGroup className="img-upload">
                                                                {
                                                                    this.state.selectedFile != null ? (
                                                                        <div>
                                                                            {
                                                                                this.state.selectedFile ? (
                                                                                    <div>
                                                                                        <img className="picture" src={REMOTE_URL + this.state.selectedFile} />
                                                                                        <i className="fa fa-remove fa-lg" onClick={() => this.removeIcon(this.state.selectedFile)}></i>
                                                                                    </div>
                                                                                ) : (null)
                                                                            }
                                                                        </div>
                                                                    ) : (
                                                                            <div>
                                                                                <p><b>Icon Image:</b></p>
                                                                                <Label className="imag" for="file-input"><i className="fa fa-upload fa-lg" style={{ color: '#20a8d8' }}></i></Label>
                                                                                <span style={{ marginLeft: '20px' }}><b>Or</b> Enter URL</span>
                                                                                <Input
                                                                                    type="url"
                                                                                    id="image"
                                                                                    name="filename"
                                                                                    className="form-control"
                                                                                    defaultValue={this.state.filename}
                                                                                    onChange={(e) =>
                                                                                        this.state.filename = e.target.value
                                                                                    }
                                                                                    style={{ display: 'inline-block', width: 'calc(100% - 240px)', marginLeft: '20px' }}
                                                                                    placeholder="Please Enter URL"
                                                                                    required
                                                                                />
                                                                                <Button style={{ marginLeft: '15px' }} className="mt-0" type="button" size="sm" color="primary" onClick={this.onURLChangeHandler.bind(this)}>Upload</Button>
                                                                                <Input
                                                                                    id="file-input"
                                                                                    type="file"
                                                                                    className="form-control"
                                                                                    name="file"
                                                                                    onChange={this.onChangeHandler.bind(this)}
                                                                                />

                                                                            </div>
                                                                        )
                                                                }
                                                                <div style={{ fontSize: 12, color: "red" }}>
                                                                    {this.state.selectedFileerror}
                                                                </div>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col xs="6">
                                                            <FormGroup className="img-upload">
                                                                {
                                                                    this.state.bannerselectedFile != null ? (
                                                                        <div>
                                                                            {
                                                                                this.state.bannerselectedFile ? (
                                                                                    <div>
                                                                                        <img className="picture" src={REMOTE_URL + this.state.bannerselectedFile} />
                                                                                        <i className="fa fa-remove fa-lg" onClick={() => this.removeIconPath(this.state.bannerselectedFile)}></i>
                                                                                    </div>
                                                                                ) : (null)
                                                                            }
                                                                        </div>
                                                                    ) : (
                                                                            <div>
                                                                                <p><b>Banner Image:</b></p>
                                                                                <Label className="imag" for="file-input1"><i className="fa fa-upload fa-lg" style={{ color: '#20a8d8' }}></i></Label>
                                                                                <span style={{ marginLeft: '20px' }}><b>Or</b> Enter URL</span>
                                                                                <Input
                                                                                    type="url"
                                                                                    id="image"
                                                                                    name="bannerfilename"
                                                                                    className="form-control"
                                                                                    defaultValue={this.state.bannerfilename}
                                                                                    onChange={(e) =>
                                                                                        this.state.bannerfilename = e.target.value
                                                                                    }
                                                                                    style={{ display: 'inline-block', width: 'calc(100% - 240px)', marginLeft: '20px' }}
                                                                                    placeholder="Please Enter URL"
                                                                                    required
                                                                                />
                                                                                <Button style={{ marginLeft: '15px' }} className="mt-0" type="button" size="sm" color="primary" onClick={this.onURLHandler.bind(this)}>Upload</Button>
                                                                                <Input
                                                                                    id="file-input1"
                                                                                    type="file"
                                                                                    className="form-control"
                                                                                    name="filet"
                                                                                    onChange={this.onHandler.bind(this)}
                                                                                />

                                                                            </div>
                                                                        )
                                                                }
                                                                {/* <div style={{ fontSize: 12, color: "red" }}>
                                                            {this.state.bannerselectedFileerror}
                                                        </div> */}
                                                            </FormGroup>
                                                        </Col>

                                                    </Row>


                                                </div>
                                            ) : (
                                                    //Advertiser App
                                                    <div>
                                                        <Row>
                                                            <Col xs="6">
                                                                <FormGroup>
                                                                    <Label htmlFor="name"><b>Name:</b></Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="name"
                                                                        name="name"
                                                                        className="form-control"
                                                                        defaultValue={this.state.name}
                                                                        onChange={this.handleChangeEvent}
                                                                        placeholder="Enter your appname"
                                                                        required
                                                                    />
                                                                    <div style={{ fontSize: 12, color: "red" }}>
                                                                        {this.state.nameerror}
                                                                    </div>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col xs="6">
                                                                <FormGroup>
                                                                    <Label htmlFor="package"><b>Package:</b></Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="package"
                                                                        name="package"
                                                                        className="form-control"
                                                                        defaultValue={this.state.package}
                                                                        onChange={this.handleChangeEvent}
                                                                        placeholder="Enter your package"
                                                                        required
                                                                    />
                                                                    <div style={{ fontSize: 12, color: "red" }}>
                                                                        {this.state.packageerrror}
                                                                    </div>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="6">
                                                                <FormGroup>
                                                                    <Label htmlFor="privacy"><b>Privacy Policy:</b></Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="privacy"
                                                                        name="privacy"
                                                                        className="form-control"
                                                                        defaultValue={this.state.privacy}
                                                                        onChange={this.handleChangeEvent}
                                                                        rows="4"
                                                                        placeholder="Enter privacy policy content..."
                                                                        required
                                                                    />
                                                                    {/* <div style={{ fontSize: 12, color: "red" }}>
                                                                {this.state.privacyerror}
                                                            </div> */}
                                                                </FormGroup>
                                                            </Col>

                                                            <Col xs="6">
                                                                {
                                                                    this.props.id ? (
                                                                        <FormGroup>
                                                                            <Label for="exampleCustomSelect"><b>Select Type:</b></Label>
                                                                            <Input
                                                                                type="select"
                                                                                className="form-control"
                                                                                id="exampleCustomSelect"
                                                                                name="customSelect"
                                                                                onChange={this.onItemSelect}
                                                                            >
                                                                                <option value="">{this.state.App.type == 1 ? 'Android' : (this.state.App.type == 2 ? 'IOS' : (this.state.App.type == 3 ? 'Web' : null))}</option>
                                                                                <option value="1">Android</option>
                                                                                <option value="2">IOS</option>
                                                                                <option value="3">Web</option>

                                                                            </Input>
                                                                            <div style={{ fontSize: 12, color: "red" }}>
                                                                                {this.state.customSelecterror}
                                                                            </div>
                                                                        </FormGroup>
                                                                    ) : (

                                                                            <FormGroup>
                                                                                <Label for="exampleCustomSelect"><b>Select Type:</b></Label>
                                                                                <Input
                                                                                    type="select"
                                                                                    className="form-control"
                                                                                    id="exampleCustomSelect"
                                                                                    name="customSelect"
                                                                                    onChange={this.onItemSelect}
                                                                                >
                                                                                    <option value="">Select Type:</option>
                                                                                    <option value="1">Android</option>
                                                                                    <option value="2">IOS</option>
                                                                                    <option value="3">Web</option>

                                                                                </Input>
                                                                                <div style={{ fontSize: 12, color: "red" }}>
                                                                                    {this.state.customSelecterror}
                                                                                </div>
                                                                            </FormGroup>
                                                                        )
                                                                }
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="6">
                                                                <FormGroup>
                                                                    <Label htmlFor="Link"><b>Link:</b></Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="Link"
                                                                        name="link"
                                                                        className="form-control"
                                                                        defaultValue={this.state.link}
                                                                        onChange={this.handleChangeEvent}
                                                                        placeholder="Enter URL"
                                                                        required
                                                                    />
                                                                    {/* <div style={{ fontSize: 12, color: "red" }}>
                                                                {this.state.linkerror}
                                                            </div> */}
                                                                </FormGroup>
                                                            </Col>
                                                            <Col xs="6">
                                                                <FormGroup>
                                                                    <Label htmlFor="Data"><b>Data:</b></Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="Data"
                                                                        name="data"
                                                                        className="form-control"
                                                                        defaultValue={this.state.data}
                                                                        onChange={this.handleChangeEvent}
                                                                        placeholder="Enter your data"
                                                                        required
                                                                    />
                                                                    {/* <div style={{ fontSize: 12, color: "red" }}>
                                                                {this.state.dataerror}
                                                            </div> */}
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="12">
                                                                <FormGroup>
                                                                    <Label htmlFor="description"><b>Description:</b></Label>
                                                                    <Input
                                                                        type="textarea"
                                                                        id="description"
                                                                        name="description"
                                                                        className="form-control"
                                                                        defaultValue={this.state.description}
                                                                        onChange={this.handleChangeEvent}
                                                                        rows="4"
                                                                        placeholder="Content..."
                                                                        required
                                                                    />
                                                                    <div style={{ fontSize: 12, color: "red" }}>
                                                                        {this.state.descriptionerror}
                                                                    </div>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col xs="3">
                                                                <Label htmlFor="userrole"><b>Status:</b></Label>
                                                                <br />
                                                                <FormGroup check inline>
                                                                    <Input
                                                                        type="radio"
                                                                        id="inline-radio36"
                                                                        defaultValue="1"
                                                                        checked={this.state.status == 1 ? this.state.statuscheck1 : !this.state.statuscheck1}
                                                                        name="status"
                                                                        onChange={this.handleChangeStatus}
                                                                    />
                                                                    <Label
                                                                        className="form-check-label"
                                                                        check htmlFor="inline-radio36"
                                                                    >
                                                                        Active
                                                 </Label>

                                                                </FormGroup>
                                                                <FormGroup check inline>
                                                                    <Input
                                                                        type="radio"
                                                                        id="inline-radio65"
                                                                        defaultValue="0"
                                                                        checked={this.state.status == 0 ? this.state.statuscheck1 : !this.state.statuscheck1}
                                                                        name="status"
                                                                        onChange={this.handleChangeStatus}
                                                                    />

                                                                    <Label
                                                                        className="form-check-label"
                                                                        check htmlFor="inline-radio65"
                                                                    >
                                                                        InActive
                                                 </Label>

                                                                </FormGroup>
                                                                <div style={{ fontSize: 12, color: "red" }}>
                                                                    {this.state.statuserror}
                                                                </div>
                                                            </Col>

                                                            <Col xs="3">
                                                                <Label htmlFor="inline-radio7896"><b>WebView:</b></Label>
                                                                <br />
                                                                <FormGroup check inline>
                                                                    <Input
                                                                        type="radio"
                                                                        id="inline-radio7896"
                                                                        defaultValue="1"
                                                                        checked={this.state.webviewstatus == 1 ? this.state.webviewstatuscheck1 : !this.state.webviewstatuscheck1}
                                                                        name="WebView"
                                                                        onChange={this.handleChangeWebViewStatus}
                                                                    />
                                                                    <Label
                                                                        className="form-check-label"
                                                                        check htmlFor="inline-radio7896"
                                                                    >
                                                                        Yes
                                                 </Label>

                                                                </FormGroup>
                                                                <FormGroup check inline>
                                                                    <Input
                                                                        type="radio"
                                                                        id="inline-radio4986"
                                                                        defaultValue="0"
                                                                        checked={this.state.webviewstatus == 0 ? this.state.webviewstatuscheck1 : !this.state.webviewstatuscheck1}
                                                                        name="WebView"
                                                                        onChange={this.handleChangeWebViewStatus}
                                                                    />

                                                                    <Label
                                                                        className="form-check-label"
                                                                        check htmlFor="inline-radio4986"
                                                                    >
                                                                        No
                                                 </Label>

                                                                </FormGroup>
                                                                {/* <div style={{ fontSize: 12, color: "red" }}>
                                                        {this.state.webviewstatuserror}
                                                    </div> */}
                                                            </Col>

                                                            <Col xs="3">
                                                                <Label htmlFor="userrole"><b>IsFeatures:</b></Label>
                                                                <br />
                                                                <FormGroup check inline>
                                                                    <Input
                                                                        type="radio"
                                                                        id="inline-radio02"
                                                                        defaultValue="1"
                                                                        checked={this.state.is_features == 1 ? this.state.is_featuresstatuscheck1 : !this.state.is_featuresstatuscheck1}
                                                                        name="IsFeatures"
                                                                        onChange={this.handleChangeIsFeaturesStatus}
                                                                    />
                                                                    <Label
                                                                        className="form-check-label"
                                                                        check htmlFor="inline-radio02"
                                                                    >
                                                                        Yes
                                                 </Label>

                                                                </FormGroup>
                                                                <FormGroup check inline>
                                                                    <Input

                                                                        type="radio"
                                                                        id="inline-radio30"
                                                                        defaultValue="0"
                                                                        checked={this.state.is_features == 0 ? this.state.is_featuresstatuscheck1 : !this.state.is_featuresstatuscheck1}
                                                                        name="IsFeatures"
                                                                        onChange={this.handleChangeIsFeaturesStatus}
                                                                    />

                                                                    <Label
                                                                        className="form-check-label"
                                                                        check htmlFor="inline-radio30"
                                                                    >
                                                                        No
                                                 </Label>

                                                                </FormGroup>
                                                                {/* <div style={{ fontSize: 12, color: "red" }}>
                                                            {this.state.statuserror}
                                                        </div> */}
                                                            </Col>
                                                            <Col xs="3">
                                                                <Label>
                                                                    <b>IsLive:</b>
                                                                </Label>
                                                                <br />
                                                                <Switch onChange={this.handleChange} checked={this.state.checked} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs="6">
                                                                <FormGroup className="img-upload">
                                                                    {
                                                                        this.state.selectedFile != null ? (
                                                                            <div>
                                                                                {
                                                                                    this.state.selectedFile ? (
                                                                                        <div>
                                                                                            <img className="picture" src={REMOTE_URL + this.state.selectedFile} />
                                                                                            <i className="fa fa-remove fa-lg" onClick={() => this.removeIcon(this.state.selectedFile)}></i>
                                                                                        </div>
                                                                                    ) : (null)
                                                                                }
                                                                            </div>
                                                                        ) : (
                                                                                <div>
                                                                                    <p><b>Icon Image:</b></p>
                                                                                    <Label className="imag" for="file-input"><i className="fa fa-upload fa-lg" style={{ color: '#20a8d8' }}></i></Label>
                                                                                    <span style={{ marginLeft: '20px' }}><b>Or</b> Enter URL</span>
                                                                                    <Input
                                                                                        type="url"
                                                                                        id="image"
                                                                                        name="filename"
                                                                                        className="form-control"
                                                                                        defaultValue={this.state.filename}
                                                                                        onChange={(e) =>
                                                                                            this.state.filename = e.target.value
                                                                                        }
                                                                                        style={{ display: 'inline-block', width: 'calc(100% - 240px)', marginLeft: '20px' }}
                                                                                        placeholder="Please Enter URL"
                                                                                        required
                                                                                    />
                                                                                    <Button style={{ marginLeft: '15px' }} className="mt-0" type="button" size="sm" color="primary" onClick={this.onURLChangeHandler.bind(this)}>Upload</Button>
                                                                                    <Input
                                                                                        id="file-input"
                                                                                        type="file"
                                                                                        className="form-control"
                                                                                        name="file"
                                                                                        onChange={this.onChangeHandler.bind(this)}
                                                                                    />

                                                                                </div>
                                                                            )
                                                                    }
                                                                    <div style={{ fontSize: 12, color: "red" }}>
                                                                        {this.state.selectedFileerror}
                                                                    </div>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col xs="6">
                                                                <FormGroup className="img-upload">
                                                                    {
                                                                        this.state.bannerselectedFile != null ? (
                                                                            <div>
                                                                                {
                                                                                    this.state.bannerselectedFile ? (
                                                                                        <div>
                                                                                            <img className="picture" src={REMOTE_URL + this.state.bannerselectedFile} />
                                                                                            <i className="fa fa-remove fa-lg" onClick={() => this.removeIconPath(this.state.bannerselectedFile)}></i>
                                                                                        </div>
                                                                                    ) : (null)
                                                                                }
                                                                            </div>
                                                                        ) : (
                                                                                <div>
                                                                                    <p><b>Banner Image:</b></p>
                                                                                    <Label className="imag" for="file-input"><i className="fa fa-upload fa-lg" style={{ color: '#20a8d8' }}></i></Label>
                                                                                    <span style={{ marginLeft: '20px' }}><b>Or</b> Enter URL</span>
                                                                                    <Input
                                                                                        type="url"
                                                                                        id="image"
                                                                                        name="bannerfilename"
                                                                                        className="form-control"
                                                                                        defaultValue={this.state.bannerfilename}
                                                                                        onChange={(e) =>
                                                                                            this.state.bannerfilename = e.target.value
                                                                                        }
                                                                                        style={{ display: 'inline-block', width: 'calc(100% - 240px)', marginLeft: '20px' }}
                                                                                        placeholder="Please Enter URL"
                                                                                        required
                                                                                    />
                                                                                    <Button style={{ marginLeft: '15px' }} className="mt-0" type="button" size="sm" color="primary" onClick={this.onURLHandler.bind(this)}>Upload</Button>
                                                                                    <Input
                                                                                        id="file-input"
                                                                                        type="file"
                                                                                        className="form-control"
                                                                                        name="file"
                                                                                        onChange={this.onHandler.bind(this)}
                                                                                    />

                                                                                </div>
                                                                            )
                                                                    }
                                                                    {/* <div style={{ fontSize: 12, color: "red" }}>
                                                                {this.state.bannerselectedFileerror}
                                                            </div> */}
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                )
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                ) : (null)}
            </div>
        );
    }
}

export default CreateApp;