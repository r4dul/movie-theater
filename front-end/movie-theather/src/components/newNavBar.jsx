import React, { Component } from "react";
import { Link } from "react-router-dom";

import logo from '../logo/popcorn.svg';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



class NewNavBar extends Component {
  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      scrolled: false
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", () => {
      const isTop = window.scrollY < 100;
      if (isTop !== true) {
        this.setState({ scrolled: true });
      } else {
        this.setState({ scrolled: false });
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll");
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    const collapsed = this.state.collapsed;
    const classOne = collapsed
      ? "collapse navbar-collapse"
      : "collapse navbar-collapse show";
    const classTwo = collapsed
      ? "navbar-toggler navbar-toggler-right collapsed"
      : "navbar-toggler navbar-toggler-right";
    return (

      <nav className={this.state.scrolled ? "navbar navbar-expand-lg navbar-dark bg-dark transparent-nav fixed-top" : "navbar navbar-expand-lg navbar-dark bg-dark transparent-nav fixed-top"}>
        
        <a className="navbar-brand" href="/" >
          <img src={logo} width="30" height="30" className="d-inline-block align-top" style={{marginRight:5}} alt="Brand"/>

          Movie <small> theater</small>
        </a>
        <button
          onClick={this.toggleNavbar}
          className={`${classTwo}`}
          type="button"
          data-toggle="collapse"
          data-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          {/* <span className="navbar-icon" /> */}

          <a href="#" className="nav">
            <div className="one"></div>
            <div className="two"></div>
            <div className="three"></div>
          </a>
          
        </button>
        <div className={`${classOne}`} id="navbarResponsive">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item ">
              <Link className="nav-link" to="/movies">
                <i className="fa fa-film" /> Movies
              </Link>
            </li>
            {this.props.user && (
              <li className="nav-item ">
                <Link className="nav-link" to="/watchlist">
                  {/* {this.props.user.sub}'s */}
                  <i className="fa fa-cart-plus" /> Watchlist
                </Link>
              </li>
            )}

            {this.props.user &&
              this.props.user.role.filter(r => r.authority === "ROLE_ADMIN")
                .length > 0 && (
                <li className="nav-item">
                  <Link className="nav-link" to="/addMovie">
                    <i className="fa fa-ticket" /> Add movie
                  </Link>
                </li>
              )}

            {!this.props.user && (
              <li className="nav-item ">
                <Link className="nav-link" to="/login">
                  <i className="fa fa-user" /> Login
                </Link>
              </li>
            )}

            {!this.props.user && (
              <li className="nav-item ">
                <Link className="nav-link" to="/register">
                  <i className="fa fa-user-plus" /> Register
                </Link>
              </li>
            )}

            {this.props.user && (

              <li className="nav-item ">
                <Link className="nav-link" to="/profile">
                  {/* {this.props.user.sub}'s  */}
                  <i className="fa fa-user-circle-o" /> Profile
                </Link>
              </li>
            )}

            {this.props.user && (
              <li className="nav-item ">
                <Link className="nav-link" to="/logout">
                  <i className="fa fa-power-off" /> Logout
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}
export default NewNavBar;
