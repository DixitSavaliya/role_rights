import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Badge, Nav, NavItem, NavLink as RsNavLink } from 'reactstrap';
import classNames from 'classnames';
import Swal from 'sweetalert2';
import { EventEmitter } from '../../event';
import NavBar from './_nav';
import navRight from './navAdvertiser';
import navRightPublisher from './navPublisher';
import SidebarFooter from './../SidebarFooter';
import SidebarForm from './../SidebarForm';
import SidebarHeader from './../SidebarHeader';
import SidebarMinimizer from './../SidebarMinimizer';
import Auth from '../../redux/Auth';
// import checkRights from '../../rights';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rightdata: '',
      id: '',
      isOwn: false,
      flag: 1
    }
    this.getUsers = this.getUsers.bind(this);
  }


  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName, props) {
    // return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
    return props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';

  }

  getUsers() {
    let user_right = JSON.parse(Auth.getRight());
    this.setState({
      rightdata: this.state.rightdata = user_right
    })
  }

  componentWillReceiveProps(data) {
    this.setState({
      rightdata: this.state.rightdata = data.auth.rights
    })
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
    this.setState({
      rightdata: this.state.rightdata = this.props.auth.rights
    })
  }

  render() {
    if (this.state.rightdata.length > 0) {
      var items = [];
      var navArray = NavBar.items.slice(0);
      for (var j = 0; j < navArray.length; j++) {
        for (var i = 0; i < this.state.rightdata.length; i++) {
          if (navArray[j].module == this.state.rightdata[i].name) {
            if (navArray[j].children != undefined && navArray[j].children.length > 0) {
              var child = navArray[j].children;
              var children = [];
              for (var k = 0; k < child.length; k++) {
                if (this.props.auth.auth_data.user_group == "admin") {
                  /* if (child[k].sub_module == "list" && (this.state.rightdata[i].write == 1 || this.state.rightdata[i].delete == 1)) {
                    children.push(child[k]);
                  } */
                  if (child[k].sub_module == "list" || child[k].sub_module == "view") {
                    children.push(child[k]);
                  }
                  if (
                    (child[k].sub_module == "create" || child[k].sub_module == "edit") &&
                    (this.state.rightdata[i].write == 1 || this.state.rightdata[i].delete == 1)
                  ) {
                    children.push(child[k]);
                  }

                  if (this.state.rightdata[i].write == 1 || this.state.rightdata[i].delete == 1 || this.state.rightdata[i].read == 1) {
                    if (child[k].sub_module == "user_role" || child[k].sub_module == "user_right" || child[k].sub_module == "user_role_to_right") {
                      children.push(child[k]);
                    }
                  }
                } else {
                  if (
                    (child[k].sub_module == "create" || child[k].sub_module == "edit") &&
                    (this.state.rightdata[i].write == 1 || this.state.rightdata[i].delete == 1)
                  ) {
                    children.push(child[k]);
                  } else if (child[k].sub_module == "list" || child[k].sub_module == "view") {
                    children.push(child[k]);
                  }
                }
              }
              navArray[j].children = children
            }
            items.push(navArray[j]);
          }
        }
      }
      this.props.sidebar.navbar = items;
    }

    const props = this.props;
    const { sidebar } = this.props;
    const activeRoute = this.activeRoute;
    const handleClick = this.handleClick;

    // badge addon to NavItem
    const badge = (badge) => {
      if (badge) {
        const classes = classNames(badge.class);
        return (<Badge className={classes} color={badge.variant}>{badge.text}</Badge>)
      }
    };

    // simple wrapper for nav-title item
    const wrapper = item => { return (item.wrapper && item.wrapper.element ? (React.createElement(item.wrapper.element, item.wrapper.attributes, item.name)) : item.name) };

    // nav list section title
    const title = (title, key) => {
      const classes = classNames('nav-title', title.class);
      return (<li key={key} className={classes}>{wrapper(title)} </li>);
    };

    // nav list divider
    const divider = (divider, key) => {
      const classes = classNames('divider', divider.class);
      return (<li key={key} className={classes}></li>);
    };

    // nav item with nav link
    const navItem = (item, key) => {
      const classes = {
        item: classNames(item.class),
        link: classNames('nav-link', item.variant ? `nav-link-${item.variant}` : ''),
        icon: classNames(item.icon)
      };
      return (
        navLink(item, key, classes)
      )
    };

    // nav link
    const navLink = (item, key, classes) => {
      const url = item.url ? item.url : '';
      return (
        <NavItem key={key} className={classes.item}>
          {isExternal(url) ?
            <RsNavLink href={url} className={classes.link} active>
              <i className={classes.icon}></i>{item.name}{badge(item.badge)}
            </RsNavLink>
            :
            <NavLink to={url} className={classes.link} activeClassName="active">
              <i className={classes.icon}></i>{item.name}{badge(item.badge)}
            </NavLink>
          }
        </NavItem>
      )
    };

    // nav dropdown
    const navDropdown = (item, key) => {
      return (
        <li key={key} className={activeRoute(item.url, props)}>
          <a className="nav-link nav-dropdown-toggle" href="#" onClick={handleClick.bind(this)}><i className={item.icon}></i>{item.name}</a>
          <ul className="nav-dropdown-items">
            {navList(item.children)}
          </ul>
        </li>)
    };

    // nav type
    const navType = (item, idx) =>
      item.title ? title(item, idx) :
        item.divider ? divider(item, idx) :
          item.children ? navDropdown(item, idx)
            : navItem(item, idx);

    // nav list
    const navList = (items) => {
      //console.log("items", items)
      return items.map((item, index) => navType(item, index));
    };

    const isExternal = (url) => {
      const link = url ? url.substring(0, 4) : '';
      return link === 'http';
    };

    // sidebar-nav root
    return (
      <div className="sidebar">
        <SidebarHeader />
        <SidebarForm />
        <nav className="sidebar-nav">
          <Nav>
            {navList(sidebar.navbar)}
          </Nav>
        </nav>
        <SidebarFooter />
        <SidebarMinimizer />
      </div>
    )
  }


}

export default Sidebar;
