import React, { Component } from 'react';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { REMOTE_URL } from '../../redux/constants/index';
import './header.css';
import Auth from '../../redux/Auth';
import { EventEmitter } from '../../event';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

class HeaderDropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      isImage: false,
      image:''
    };
    this.toggle = this.toggle.bind(this);
    this.Logout = this.Logout.bind(this);
  }

  componentDidMount() {
    // if(this.props.auth.auth_data) {
    //   this.props.getUser(this.props.auth.auth_data.id).then((res) => {
    
    //   });
    // }

    EventEmitter.subscribe('updateImage', (data) => {
      this.setState({
        isImage:this.state.isImage = true,
        image:this.state.image = data
      })
    });

    EventEmitter.subscribe('removeImage', (data) => {
      this.setState({
        isImage:this.state.isImage = false
      })
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: this.state.dropdownOpen = !this.state.dropdownOpen
    });
  }

  Logout() {
    if (this.props.auth.auth_data.user_group == "admin" || this.props.auth.auth_data.user_group == "admin_staff") {
      Auth.removeAuthenticateUser('ad_network_user');
      Auth.removeAuth('ad_network_auth');
      window.sessionStorage.removeItem('ad_network_auth_right');
      this.props.history.push(this.props.from || { pathname: '/admin/' });
    } else {
      Auth.removeAuthenticateUser('ad_network_user');
      Auth.removeAuth('ad_network_auth');
      window.sessionStorage.removeItem('ad_network_auth_right');
      this.props.history.push(this.props.from || { pathname: '/login' });
    }
  }


  render() {
    let auth = JSON.parse(window.sessionStorage.getItem('ad_network_user'));
    let authRights = JSON.parse(window.sessionStorage.getItem('ad_network_auth_right'));
    if(auth) {
      this.props.auth.user = auth;
    }
    if(authRights) {
      this.props.auth.rights = authRights;
    }
    return (
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          {
            this.state.isImage == false ? (
              <div>
                {
                  this.props.auth.user.avatar ? (

                    <img src={REMOTE_URL + this.props.auth.user.avatar} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  ) : (
                      <img src={require('./1.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                    )
                }
              </div>
            ) : (
                <div>
                  {
                    this.state.image ? (
                      <img src={REMOTE_URL +  this.state.image} className="img-avatar" alt="admin@bootstrapmaster.com" />
                    ) : (
                        <img src={require('./1.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                      )
                  }
                </div>
              )
          }

          {/* <span className="d-md-down-none">{this.props.auth.user.username}</span> */}
        </DropdownToggle>
        <DropdownMenu right>
          {/* <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
          <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem> */}
          <DropdownItem header tag="div" className="text"><strong>Settings</strong></DropdownItem>
          <DropdownItem className="text"><Link to="/Profile"><i className="fa fa-user"></i> Profile</Link></DropdownItem>
          <DropdownItem className="text"><Link to="/change-password"><i className="fa fa-user"></i> ChangePassword</Link></DropdownItem>
          {/* <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
          <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
          <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
          <DropdownItem divider/>
          <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem> */}
          <DropdownItem onClick={this.Logout}><i className="fa fa-lock"></i> Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default HeaderDropdown;
