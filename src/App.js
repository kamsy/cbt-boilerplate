import React, { Suspense, useEffect, useState, useRef } from "react";
import { clear, decryptAndRead } from "./services/localStorageHelper";
import "antd/dist/antd.css";
import "./scss/global.scss";
// layouts
import ProtectedLayout from "./components/ProtectedLayout";
import AuthLayout from "./components/AuthLayout";
import { Loader } from "./components/Loader";

import { Switch, Route, Redirect, useHistory } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Private/Dashboard";
import { ENCRYPT_USER } from "./variables";
import Page404 from "./pages/Public/404";

//
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
const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route exact {...rest}>
            {fakeAuth.isAuthenticated ? (
                <ProtectedLayout {...{ fakeAuth }}>
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

const App = () => {
    const history = useHistory();
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
                <Switch>
                    <Route exact path="/">
                        <Landing {...{ fakeAuth }} />
                    </Route>
                    <Route
                        // if it falls on the localhost:PORT/
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
                    <PrivateRoute
                        path={`${url}dashboard`}
                        component={Dashboard}
                    />
                    <Route exact path={`${url}#/404`} component={Page404} />
                    <Route path="*" component={Page404} />
                </Switch>
            </Suspense>
        );
    }
    return <Loader loading />;
};

export default App;
