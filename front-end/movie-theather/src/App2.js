import React, { useContext, useState, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Redirect, Switch, __RouterContext } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import auth from "./services/authService";
import logo from "./logo.png";
import NewNavBar from "./components/newNavBar";
import { Helmet } from "react-helmet";
import { useTransition, animated } from "react-spring";
import useScrollStatus from "./components/common/useSctrollStatus";
import ScrollTracker from "./components/common/scrollTracker";
import art from "./logo/sca.jpg";
import Backgr from "./components/common/backgr";
import "./App.css";
// import Logout from "./components/logout";
// import EmailConfirmation from "./components/emailConfirmation";
// import Watchlist from "./components/watchList";
// import Profile from "./components/profile";
// import Jumbo from "./components/common/jumbo";
// import Details from "./components/details";
// import MoviesTable from "./components/moviesTable";
// import NewLoginForm from "./components/newLoginForm";
// import NewRegisterForm from "./components/newRegister";
// import NewMovieForm from "./components/newMovieForm";

const Jumbo = React.lazy(() => import("./components/common/jumbo"));
const Watchlist = React.lazy(() => import("./components/watchList"));
const MoviesTable = React.lazy(() => import("./components/moviesTable"));
const NewRegisterForm = React.lazy(() => import("./components/newRegister"));
const NewLoginForm = React.lazy(() => import("./components/newLoginForm"));
const NewMovieForm = React.lazy(() => import("./components/newMovieForm"));
const Profile = React.lazy(() => import("./components/profile"));
const Details = React.lazy(() => import("./components/details"));
const EmailConfirmation = React.lazy(() =>
  import("./components/emailConfirmation")
);
const Logout = React.lazy(() => import("./components/logout"));
const PublicProfile = React.lazy(() => import("./components/publicProfile"));

function App() {
  const [user, setUs] = useState(auth.getCurrentUser());

  const scrollState = useScrollStatus();

  const { location } = useContext(__RouterContext);

  const transitions = useTransition(location, location => location.pathname, {
    from: { opacity: 0, transform: "translate(-75%,0%)" },
    enter: { opacity: 1, transform: "translate(0%,0%)" },
    leave: { opacity: 0, transform: "translate(100%,0%)" }
  });

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
      <ScrollTracker position={scrollState.position} />

      <Backgr />
      {/* <div id="bg">
        <img src={art} />
      </div> */}
      <link rel="icon" type="image/png" href={logo} />
      <ToastContainer
        autoClose="3000"
        position="bottom-left"
        closeOnClick
        newestOnTop
      />
      <NewNavBar user={user} />
      <div className="spacer" />

      {user && (
        <Suspense fallback={<div>Loading...</div>}>
          {" "}
          <Jumbo user={user.name} />{" "}
        </Suspense>
      )}

      {transitions.map(({ item, props, key }) => (
        <animated.div key={key} style={props}>
          <Switch location={item}>
            <Route
              exact
              path="/watchlist"
              render={props => (
                <Suspense fallback={<h1 className="text-white">Loading...</h1>}>
                  {" "}
                  <Watchlist {...props} user={user} />{" "}
                </Suspense>
              )}
            />

            <Route
              exact
              path="/movies"
              render={props => (
                <Suspense fallback={<h1 className="text-white">Loading...</h1>}>
                  {" "}
                  <MoviesTable {...props} user={user} />{" "}
                </Suspense>
              )}
            />
            {/* <Route path="/movie/:id" component={Movie} /> */}
            {/* <Route path="/movie/:id" component={Details} /> */}
            <Route
              path="/movie/:id"
              render={props => (
                <Suspense fallback={<h1 className="text-white">Loading...</h1>}>
                  <Details {...props} />
                </Suspense>
              )}
            />

            {user &&
            user.role.filter(r => r.authority === "ROLE_ADMIN").length > 0 ? (
              // <Route path="/addMovie" component={NewMovieForm} />
              <Route
                path="/addMovie"
                render={props => (
                  <Suspense
                    fallback={<h1 className="text-white">Loading...</h1>}
                  >
                    <NewMovieForm {...props} />
                  </Suspense>
                )}
              />
            ) : (
              <Redirect from="/addMovie" exact to="/movies" />
            )}

            {/* <Route path="/register" component={NewRegisterForm} /> */}
            <Route
              path="/register"
              render={props => (
                <Suspense fallback={<h1 className="text-white">Loading...</h1>}>
                  <NewRegisterForm {...props} />
                </Suspense>
              )}
            />

            {/* <Route path="/login" component={NewLoginForm} /> */}
            <Route
              path="/login"
              render={props => (
                <Suspense fallback={<h1 className="text-white">Loading...</h1>}>
                  <NewLoginForm {...props} />
                </Suspense>
              )}
            />

            {/* <Route path="/logout" component={Logout} /> */}
            <Route
              path="/logout"
              render={props => (
                <Suspense fallback={<h1 className="text-white">Loading...</h1>}>
                  <Logout {...props} />
                </Suspense>
              )}
            />

            {/* <Route path="/verifyEmail" component={EmailConfirmation} /> */}
            <Route
              path="/verifyEmail"
              render={props => (
                <Suspense fallback={<h1 className="text-white">Loading...</h1>}>
                  <EmailConfirmation {...props} />
                </Suspense>
              )}
            />

            <Route
              path="/profile/:id"
              render={props => (
                <Suspense fallback={<h1 className="text-white">Loading...</h1>}>
                  <PublicProfile {...props} />
                </Suspense>
              )}
            />

            {/* <Route path="/profile" component={Profile} /> */}
            <Route
              path="/profile"
              render={props => (
                <Suspense fallback={<h1 className="text-white">Loading...</h1>}>
                  <Profile {...props} />
                </Suspense>
              )}
            />

            <Route
              exact
              path="/"
              render={props => (
                <Suspense
                  fallback={
                    <div>
                      <h1 classname="text-white">Loading...</h1>
                    </div>
                  }
                >
                  {" "}
                  <MoviesTable {...props} user={user} />{" "}
                </Suspense>
              )}
            />
            {/* <Redirect from="/" exact to="/movies" /> */}
            {/* <Redirect from="/movie" exact to="/movies" /> */}
          </Switch>
        </animated.div>
      ))}

      {/* <Footer /> */}
    </div>
  );
}

export default App;
