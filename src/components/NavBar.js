import React, { Component } from "react";
import { Link } from "react-router-dom";

//img
import logo from "../img/logo.png";

//functions
import { interpolateToggle } from "../functions/interpolateToggle";

class NavBar extends Component {
  showMenu() {
    if (window.innerWidth < 700) {
      interpolateToggle(".nav-links");
    }
  }

  render() {
    return (
      <div className="navbar-container">
        <div className="my-navbar">
          <Link to="/" className="logo" onClick={this.showMenu}>
            <img src={logo} alt="" href="#" className="nash-logo-link" />
            <div className="app-name-text">Lunch</div>
          </Link>
          <div className="menu-button" onClick={this.showMenu}>
            <i className="material-icons">menu</i>
          </div>
          <div className="nav-links">
            <Link to="/">
              <div className="nav-link" onClick={this.showMenu}>
                Admin Calendar
              </div>
            </Link>
            <Link to="/userdash">
              <div className="nav-link" onClick={this.showMenu}>
                My Profile
              </div>
            </Link>

            <Link to="/attendlunch">
              <div className="nav-link" onClick={this.showMenu}>
                Attend Lunch
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;
