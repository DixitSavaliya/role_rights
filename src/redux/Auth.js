class Auth {
  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {object} token
   */
  static setAuth(token) {
    window.sessionStorage.setItem('ad_network_auth', JSON.stringify(token));
  }

  static removeAuth() {
    window.sessionStorage.removeItem('ad_network_auth');
  }

  static getAuth() {
    return window.sessionStorage.getItem('ad_network_auth');
  }

  static setRight(data) {
    window.sessionStorage.setItem('ad_network_auth_right', JSON.stringify(data));
  }

  static getRight() {
    return window.sessionStorage.getItem('ad_network_auth_right');
  }

  static authenticateUser(user) {
    window.sessionStorage.setItem('ad_network_user', JSON.stringify(user));
  }

  /**
   * Check if a user is authenticated - check if a user is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    var flag = false;
    if(window.sessionStorage.getItem('ad_network_auth') !== null) {
      let auth =  JSON.parse(window.sessionStorage.getItem('ad_network_auth'));
      if(auth.id){
        flag = true;
      }
    }
    return flag;
    // return window.sessionStorage.getItem('ad_network_auth') !== null && window.sessionStorage.getItem('ad_network_user') !== null;
  }

  static removeAuthenticateUser() {
    window.sessionStorage.removeItem('ad_network_user');
  }

  static getUser() {
    const user = window.sessionStorage.getItem('ad_network_user');
    return user ? JSON.parse(user) : null;
  }
}

export default Auth;
