import React, { Component, useContext } from "react";
import { ToastContainer } from "react-toastify";
import MovieForm from "./components/movieForm";
import { Route, Redirect, Switch, __RouterContext } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import auth from "./services/authService";
import Logout from "./components/logout";
import Movies from "./components/movies";
import RegisterForm from "./components/registerForm";
import LoginForm from "./components/loginForm";
import MoviesTable from "./components/moviesTable";
import EmailConfirmation from "./components/emailConfirmation";
//import OmdbApi from "./components/omdb";
import logo from "./logo.png";
import Watchlist from "./components/watchList";
import NewNavBar from "./components/newNavBar";
import Details from "./components/details";
import { Helmet } from "react-helmet";
import Profile from "./components/profile";
import Movie from "./components/movie";
import Jumbo from "./components/common/jumbo";
import Modal from "./modal";
import MyModal from "./modal";
import { loadProgressBar } from "axios-progress-bar";
import { useTransition, animated } from "react-spring";

class App extends Component {
  state = {};

  async componentDidMount() {
    const user = auth.getCurrentUser();
    loadProgressBar();

    //this.setState({ user });
  }
  user = auth.getCurrentUser();

  render() {
    /* <Route path="/omdb" component={OmdbApi} />      <Route
            path="/watchlist"
            render={props => <ListMovies {...props} user={this.state.user} />}
          /> */
    // const {location} = useContext(__RouterContext);

    // const transitions = useTransition(location, location => location.pathname, {
    //   from: {opacity:0, transform: "translate(100%,0%)"},
    //   enter: {opacity:1, transform: "translate(0%,0%)"},
    //   leave:{opacity:0, transform: "translate(100%,0%)"}
    // });

    return (
      <div id="root">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Movie Theater App</title>
          <meta
            name="description"
            content="The Movie Theater App will display most relevant movies based on your watchlist."
          />
        </Helmet>

        <Jumbo user={this.user.name} />

        <link rel="icon" type="image/png" href={logo} />
        <ToastContainer />
        <NewNavBar user={this.user} />

        <Switch>
          <Route path="/moviesTest" component={Movies} />
          <Route
            path="/watchlist"
            render={props => <Watchlist {...props} user={this.user} />}
          />

          <Route
            path="/movies"
            render={props => <MoviesTable {...props} user={this.user} />}
          />
          {/* <Route path="/movie/:id" component={Movie} /> */}
          <Route path="/movie/:id" component={Details} />

          {this.user &&
          this.user.role.filter(r => r.authority === "ROLE_ADMIN").length >
            0 ? (
            <Route path="/addMovie" component={MovieForm} />
          ) : (
            <Redirect from="/addMovie" exact to="/movies" />
          )}

          <Route path="/addMovie" component={MovieForm} />
          <Route path="/register" component={RegisterForm} />
          <Route path="/login" component={LoginForm} />
          <Route path="/logout" component={Logout} />
          <Route path="/verifyEmail" component={EmailConfirmation} />

          <Route path="/profile" component={Profile} />

          <Redirect from="/" exact to="/movies" />
          <Redirect from="/movie" exact to="/movies" />
        </Switch>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default App;
