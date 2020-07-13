import React, { Suspense, useEffect, useState, PureComponent } from "react";
import { clear, decryptAndRead } from "./services/localStorageHelper";
import "antd/dist/antd.css";
import "./scss/global.scss";
// layouts
import ProtectedLayout from "./components/ProtectedLayout";
import AuthLayout from "./components/AuthLayout";
import { Loader } from "./components/Loader";
import { message } from "antd";
import { Switch, Route, Redirect } from "react-router-dom";
import IdleTimer from "react-idle-timer";
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Private/Dashboard";
import Loans from "./pages/Private/Loans";
import Loan from "./pages/Private/Loan";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import { AnimatePresence } from "framer";
import Profile from "./pages/Private/Profile";
import CreateLoan from "./pages/Private/CreateLoan";
import { ENCRYPT_USER } from "./variables";
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

const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));

// Private Router function
const PrivateRoute = ({ component: Component, title, ...rest }) => {
    return (
        <Route exact {...rest}>
            {fakeAuth.isAuthenticated ? (
                <ProtectedLayout {...{ title, fakeAuth }}>
                    <Component {...rest} />
                </ProtectedLayout>
            ) : (
                <Redirect
                    to={{
                        pathname: `${url}login`
                    }}
                />
            )}
        </Route>
    );
};

const AuthRoute = ({ component: Component, ...rest }) => {
    return (
        <Route exact {...rest}>
            <AuthLayout {...{ fakeAuth }}>
                <Component />
            </AuthLayout>
        </Route>
    );
};

class IdleTimerComponent extends PureComponent {
    idleTimer = null;
    _onAction = e => {
        this.idleTimer.reset();
    };

    _onActive = e => {
        this.idleTimer.reset();
    };

    _onIdle = e => {
        if (this.idleTimer.isIdle() && loggedIn) {
            clear();
        }
    };

    render() {
        return (
            <IdleTimer
                ref={ref => (this.idleTimer = ref)}
                onActive={this._onActive}
                onIdle={this._onIdle}
                onAction={this._onAction}
                debounce={10}
                timeout={1000 * 60 * 10}
            />
        );
    }
}

const App = () => {
    const [loaded, set_loaded] = useState(false);

    useEffect(() => {
        window.addEventListener("offline", () =>
            message.error("Lost internet connection!.😢")
        );
        window.addEventListener("online", () =>
            message.success("Connection re-established!.👍🏻")
        );
    }, []);

    useEffect(() => {
        const fromStorage = decryptAndRead(ENCRYPT_USER);
        if (fromStorage) {
            if (loggedIn && !fromStorage.expired) {
                fakeAuth.authenticate();
                return set_loaded(true);
            }
            if (!loggedIn || fromStorage.expired) {
                clear();
                fakeAuth.signout();
                return set_loaded(true);
            }
        } else {
            fakeAuth.signout();
            clear();
            return set_loaded(true);
        }
    }, []);

    if (loaded) {
        return (
            <Suspense fallback={<Loader loading />}>
                {/* <IdleTimerComponent /> */}
                <AnimatePresence exitBeforeEnter>
                    <Switch>
                        <Route exact path="/">
                            <Landing {...{ fakeAuth }} />
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
                                                props.location.hash !== ""
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
                        <AuthRoute path={`${url}login`} component={Login} />
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
                        />
                        <PrivateRoute
                            path={`${url}create-loan`}
                            component={CreateLoan}
                            title="Request Loan"
                        />

                        <PrivateRoute
                            path={`${url}loans/:id`}
                            component={Loan}
                            title="Loan"
                        />
                        <PrivateRoute
                            path={`${url}loans`}
                            component={Loans}
                            title="Loan History"
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
            </Suspense>
        );
    }
    return <Loader loading />;
};

export default App;
