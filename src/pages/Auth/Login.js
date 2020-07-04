import React, { useState } from "react";
import { Button } from "antd";
import { Link, Redirect } from "react-router-dom";
import { url, fakeAuth } from "../../App";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../../components/CustomInput";
import CustomHistory from "../../services/CustomHistory";

const schema = yup.object().shape({
    username: yup.string().required("Enter your username!"),
    password: yup
        .string()
        .required("Enter your password!")
        .min(8)
});

export default () => {
    const [redirectToReferrer, set_redirectToReferrer] = useState(false);
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register } = methods;

    const onSubmit = data => {
        console.log("data", data);
        fakeAuth.authenticate();
        set_redirectToReferrer(true);
        localStorage.setItem("loggedIn", JSON.stringify(true));
    };
    if (redirectToReferrer)
        return <Redirect to={{ pathname: `${url}dashboard` }} />;
    return (
        <div className="login">
            <form
                className="form-login form"
                name="login-form"
                onSubmit={handleSubmit(onSubmit)}>
                <h1>Login</h1>
                <CustomInput
                    {...{
                        label: "Username",
                        name: "username",
                        ref: register,
                        placeholder: "Username",
                        defaultValue: "olekakamsy@gmail.com",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "Password",
                        name: "password",
                        ref: register,
                        placeholder: "Password",
                        defaultValue: "12345678",
                        type: "password",
                        errors,
                        control
                    }}
                />

                <Link to={`${url}forgot-password`} className="forgot-pw-link">
                    Forgot password?
                </Link>
                <Button className="submit-btn" onClick={handleSubmit(onSubmit)}>
                    Log in
                </Button>
            </form>
            <div className="new-user-container">
                <p>Don't have an account?</p>
                <Link to={`${url}register`} className="signup-link">
                    Sign up
                </Link>
            </div>
        </div>
    );
};
