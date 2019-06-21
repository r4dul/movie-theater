import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const NavBar = ({ user }) => {
  return (
    <div className="navigation-bar">
      <div className="mobile-navbar">
        <div className="search" />

        <div className="dropdown">
          <div className="icon">
            <i className="fa fas fa-bars fa-lg dropbtn" />
          </div>

          <div className="dropdown-content">
            <Link to="/movies">Movielist</Link>
            <Link to="/watchlist">Watchlist</Link>
            <Link to="/popular-movies">Popular movies</Link>

            {!user && (
              <div className="login">
                <Link to="/login">Login</Link>

                <Link to="/register">Register</Link>
              </div>
            )}

            {user && (
              <div className="login">
                <Link to="/profile">{user.sub}</Link>

                <Link to="/logout">Logout</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="desktop-navbar">
        <ul>
          <li>
            <Link to="/movies">Movielist</Link>
          </li>

          {user && (
            <li>
              <Link to="/watchlist">{user.sub}'s watchlist</Link>
            </li>
          )}

          {user &&
            user.role.filter(r => r.authority === "ROLE_ADMIN").length > 0 && (
              <li>
                <Link to="/addMovie">Add movie</Link>
              </li>
            )}

          <li>
            <Link to="/popular-movies">Popular movies</Link>
          </li>

          {!user && (
            <div className="login">
              <Link to="/login">
                <button>Login</button>
              </Link>

              <Link to="/register">
                <button>Register</button>
              </Link>
            </div>
          )}

          {user && (
            <div className="login">
              <Link to="/profile">
                <button>{user.sub}</button>
              </Link>

              <Link to="/logout">
                <button>Logout</button>
              </Link>
            </div>
          )}

          {/* <div className="search">
              <input
                type="search"
                placeholder="Search a movie"
                aria-label="Search"
              />
              <button type="submit">Search</button>
            </div>
          )} */}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
