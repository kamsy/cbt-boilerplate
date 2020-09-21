import React, {
    Suspense,
    useEffect,
    useState,
    PureComponent,
    useRef
} from "react";
import { clear, decryptAndRead } from "./services/localStorageHelper";
import "antd/dist/antd.css";
import "./scss/global.scss";
// layouts
import ProtectedLayout from "./components/ProtectedLayout";
import AuthLayout from "./components/AuthLayout";
import { Loader } from "./components/Loader";
import { message } from "antd";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import IdleTimer from "react-idle-timer";
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Private/Dashboard";
import Loans from "./pages/Private/Loans";
import Wallet from "./pages/Private/Wallet";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import { AnimatePresence } from "framer";
import Profile from "./pages/Private/Profile";
import CreateLoan from "./pages/Private/RequestLoan";
import { ENCRYPT_USER } from "./variables";
import Page500 from "./pages/500";
import Page404 from "./pages/404";
import Bills from "./pages/Private/Bills";
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

class IdleTimerComponent extends PureComponent {
    render() {
        return (
            <IdleTimer
                ref={ref => (this.idleTimer = ref)}
                onActive={this._onActive}
                onIdle={this._onIdle}
                onAction={this._onAction}
                debounce={10}
                timeout={1000 * 1}
            />
        );
    }
}

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
        // window._toggleLoader = () =>
        //     document.querySelector(".window-loader").classList.toggle("show");
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
    const idleTimer = useRef(null);
    const _onAction = e => {
        idleTimer.current.reset();
    };

    const _onActive = e => {
        idleTimer.current.reset();
    };

    const _onIdle = e => {
        if (idleTimer.current.isIdle() && fakeAuth.isAuthenticated) {
            clear();
            fakeAuth.signout();
            return history.push({ pathname: `${url}login` });
        }
    };

    if (loaded) {
        return (
            <Suspense fallback={<Loader loading />}>
                <IdleTimer
                    ref={idleTimer}
                    onActive={_onActive}
                    onIdle={_onIdle}
                    onAction={_onAction}
                    debounce={10}
                    // ms * sec * min
                    timeout={1000 * 60 * 10}
                />
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
                        />
                        <PrivateRoute
                            path={`${url}create-loan`}
                            component={CreateLoan}
                        />

                        <PrivateRoute path={`${url}loans`} component={Loans} />

                        <PrivateRoute path={`${url}bills`} component={Bills} />

                        <PrivateRoute
                            path={`${url}profile`}
                            component={Profile}
                        />
                        <PrivateRoute
                            path={`${url}wallet`}
                            component={Wallet}
                        />
                        <Route exact path={`${url}#/500`} component={Page500} />

                        <Route exact path={`${url}#/404`} component={Page404} />
                        <Route path="*" component={Page404} />
                    </Switch>
                </AnimatePresence>
            </Suspense>
        );
    }
    return <Loader loading />;
};

export default App;
