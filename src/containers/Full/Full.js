import React, { Component } from 'react';
import { Switch, Route, Redirect, HashRouter as Router, } from 'react-router-dom';
import { Container } from 'reactstrap';
import Header from '../../redux/containers/Header';
import Sidebar from '../../redux/containers/Sidebar';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import Dashboard from '../../views/Dashboard/';
import Charts from '../../views/Charts/';
import Widgets from '../../views/Widgets/';
import Profile from '../../redux/containers/Profile';
import ChnagePassword from '../../redux/containers/changepassword';
import UserRole from '../../redux/containers/userrole';
import UserRight from '../../redux/containers/userright';
import UserRoleToRight from '../../redux/containers/userroletoright';
import CreateApp from '../../redux/containers/createapp';
import EditApp from '../../redux/containers/createapp';
import ListApp from '../../redux/containers/listapp';
import ViewApp from '../../redux/containers/viewapp';
import Advertiser from '../../redux/containers/advertiser';
import Publisher from '../../redux/containers/publisher';
import MonetizationNetwork from '../../redux/containers/monetizationnetwork';
import CustomAds from '../../redux/containers/customads';
import Notifications from '../../redux/containers/notification';
import ListNotifications from '../../redux/containers/listnotifications';
import ViewNotifications from '../../redux/containers/viewnotifications';
import PageNotFound from '../../views/Pages/Page404/Page404';

// Components
import Buttons from '../../views/Components/Buttons/';
import Cards from '../../views/Components/Cards/';
import Forms from '../../views/Components/Forms/';
import Modals from '../../views/Components/Modals/';
import SocialButtons from '../../views/Components/SocialButtons/';
import Switches from '../../views/Components/Switches/';
import Tables from '../../views/Components/Tables/';
import Tabs from '../../views/Components/Tabs/';

// Icons
import FontAwesome from '../../views/Icons/FontAwesome/';
import SimpleLineIcons from '../../views/Icons/SimpleLineIcons/';

class Full extends Component {
  render() {
    return (
      <div className="app">
        <Header {...this.props}/>
        <div className="app-body">
          <Sidebar {...this.props} />
          <main className="main">
            <Breadcrumb {...this.props}/>
            <Container fluid>
              <Router>
                <Switch>
                  <Route path="/dashboard" name="Dashboard" >
                    <Dashboard {...this.props} />
                  </Route>
                  <Route path="/components/buttons" name="Buttons">
                    <Buttons {...this.props } /> 
                  </Route>
                  <Route path="/components/cards" name="Cards" component={Cards} />
                  <Route path="/components/forms" name="Forms" component={Forms} />
                  <Route path="/components/modals" name="Modals" component={Modals} />
                  <Route path="/components/social-buttons" name="Social Buttons" component={SocialButtons} />
                  <Route path="/components/switches" name="Swithces" component={Switches} />
                  <Route path="/components/tables" name="Tables" component={Tables} />
                  <Route path="/components/tabs" name="Tabs" component={Tabs} />
                  <Route path="/icons/font-awesome" name="Font Awesome" component={FontAwesome} />
                  <Route path="/icons/simple-line-icons" name="Simple Line Icons" component={SimpleLineIcons} />
                  <Route path="/widgets" name="Widgets" component={Widgets} />
                  <Route path="/charts" name="Charts" component={Charts} />
                  <Route path="/profile" name="Profile" component={Profile} />
                  <Route path="/change-password" name="ChangePassword" component={ChnagePassword} />
                  <Route path="/application" name="Application" component={Profile} />
                  <Route path="/userrole" name="UserRole" component={UserRole} />
                  <Route path="/userright" name="UserRight" component={UserRight} />
                  <Route path="/userroletoright" name="UserRoleToRight" component={UserRoleToRight} />
                  <Route path="/createapp" name="CreateApp" component={CreateApp} />
                  <Route path="/listapp" name="ListApp" component={ListApp} />
                  <Route path="/editapp/:id" name="EditApp" component={EditApp} />
                  <Route path="/viewapp/:id" name="ViewApp" component={ViewApp} />
                  <Route path="/advertiser" name="Advertiser" component={Advertiser} />
                  <Route path="/publisher" name="Publisher" component={Publisher} />
                  <Route path="/monetization-network" name="MonetizationNetwork" component={MonetizationNetwork} />
                  <Route path="/custom-ads" name="CustomAds" component={CustomAds} />
                  <Route path="/notifications" name="Notifications" component={Notifications} />
                  <Route path="/list-notifications" name="ListNotifications" component={ListNotifications} />
                  <Route path="/view-notification/:id" name="ViewNotifications" component={ViewNotifications} />
                  {
                    this.props.history.location.pathname != '/' ? (
                      <Route path="*" component={PageNotFound}/>
                    ) : (
                      ""
                    )
                  }
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Router>
            </Container>
          </main>
          <Aside {...this.props} />
        </div>
        <Footer {...this.props} />
      </div>
    );
  }
}

export default Full;
