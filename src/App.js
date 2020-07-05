import React, { Component, Suspense } from "react";
import { clear } from "./services/localStorageHelper";
import "antd/dist/antd.css";
// layouts
import ProtectedLayout from "./components/ProtectedLayout";
import AuthLayout from "./components/AuthLayout";
import { Loader } from "./components/Loader";
import { message } from "antd";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import IdleTimer from "react-idle-timer";
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Private/Dashboard";
import Loans from "./pages/Private/Loans";
import Payment from "./pages/Private/Payment";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import { AnimatePresence } from "framer";
import Profile from "./pages/Private/Profile";
const { localStorage } = window;
export const url = "/app/";
// variable to hold auth status and also functions to convert it
export const fakeAuth = {
    isAuthenticated: false,
    authenticate() {
        return (this.isAuthenticated = true);
    },
    signout() {
        return (this.isAuthenticated = false);
    }
};

// Private Router function
const PrivateRoute = ({ component: Component, title, ...rest }) => (
    <Route exact {...rest}>
        {fakeAuth.isAuthenticated ? (
            <ProtectedLayout title={title} fakeAuth={fakeAuth}>
                <Component {...rest} />
            </ProtectedLayout>
        ) : (
            <Redirect
                to={{
                    pathname: url
                }}
            />
        )}
    </Route>
);

const AuthRoute = ({ component: Component, ...rest }) => (
    <Route exact {...rest}>
        <AuthLayout fakeAuth={fakeAuth}>
            <Component />
        </AuthLayout>
    </Route>
);

class App extends Component {
    state = {
        loaded: true
    };

    componentDidMount() {
        window.addEventListener("offline", () =>
            message.error("Lost internet connection!.😢")
        );
        window.addEventListener("online", () =>
            message.success("Connection re-established!.👍🏻")
        );
    }

    static getDerivedStateFromProps = (props, state) => {
        const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));

        if (loggedIn) {
            fakeAuth.authenticate();
            return {
                loaded: true
            };
        }
        if (!loggedIn) {
            fakeAuth.signout();
            clear();
            return {
                loaded: true
            };
        }

        return state;
    };

    idleTimer = null;
    _onAction = e => {
        this.idleTimer.reset();
    };

    _onActive = e => {
        this.idleTimer.reset();
    };

    _onIdle = e => {
        if (this.idleTimer.isIdle() && fakeAuth.isAuthenticated) {
            fakeAuth.signout();
            clear();
        }
    };

    render() {
        const { loaded } = this.state;

        if (loaded) {
            return (
                <Suspense fallback={<Loader loading />}>
                    <IdleTimer
                        ref={ref => (this.idleTimer = ref)}
                        onActive={this._onActive}
                        onIdle={this._onIdle}
                        onAction={this._onAction}
                        debounce={10}
                        timeout={1000 * 60 * 10}
                    />
                    <Router>
                        <AnimatePresence>
                            <Switch>
                                <Route exact path="/">
                                    <Landing />
                                </Route>
                                <Route
                                    // if it falls on the localhost:3000/admin or www.smartfuel.netlify.com/admin
                                    exact
                                    path={url}
                                    render={props =>
                                        fakeAuth.isAuthenticated ? (
                                            <Redirect
                                                push
                                                to={{
                                                    pathname:
                                                        props.location.hash !==
                                                        ""
                                                            ? `${url}${props.location.hash}`
                                                            : `${url}dashboard`,
                                                    state: {
                                                        from: props.location
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <Redirect
                                                to={{
                                                    pathname: `${url}login`,
                                                    state: {
                                                        from: props.location
                                                    }
                                                }}
                                            />
                                        )
                                    }
                                />
                                <AuthRoute
                                    path={`${url}login`}
                                    component={Login}
                                />
                                <AuthRoute
                                    path={`${url}forgot-password`}
                                    component={ForgotPassword}
                                />
                                <AuthRoute
                                    path={`${url}register`}
                                    component={Register}
                                />
                                <PrivateRoute
                                    path={`${url}dashboard`}
                                    component={Dashboard}
                                    title="Dashboard"
                                />{" "}
                                <PrivateRoute
                                    path={`${url}loans`}
                                    component={Loans}
                                    title="Loans"
                                />
                                <PrivateRoute
                                    path={`${url}payment`}
                                    component={Payment}
                                    title="Bank & Card"
                                />
                                <PrivateRoute
                                    path={`${url}profile`}
                                    component={Profile}
                                    title="Account"
                                />
                                {/* <Route
                                eaxct
                                path={`${url}#/500`}
                                component={Page_500}
                            />
                            <Route
                                exact
                                path={`${url}#/403`}
                                component={Page_403}
                            />
                            <Route
                                exact
                                path={`${url}#/404`}
                                component={Page_404}
                            /> */}
                                <Route path="*"></Route>
                                {/* render={props => (
                                    <Redirect
                                        to={{
                                            pathname: `${url}#/404`
                                        }}
                                        {...props}
                                    />
                                )}
                            /> */}
                            </Switch>
                        </AnimatePresence>
                    </Router>
                </Suspense>
            );
        }
        return <Loader loading />;
    }
}

export default App;
