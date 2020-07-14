import React, { useEffect } from "react";
import "../scss/authlayout.scss";
import { useHistory } from "react-router-dom";
import { url } from "../App";

const AuthLayout ({ children, fakeAuth }) => {
    const history = useHistory();
    useEffect(() => {
        if (fakeAuth.isAuthenticated) return history.push(`${url}dashboard`);
    }, [history, fakeAuth]);
    return <div className="auth-layout layout">{children}</div>;
};


export default AuthLayout