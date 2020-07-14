import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { url, fakeAuth } from "../../App";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../../components/CustomInput";

import { motion } from "framer";
import AuthServices from "../../services/authServices";
import CustomButton from "../../components/CustomButton";
import {
    auth_pageVariants,
    auth_pageTransitions
} from "../../components/ProtectedLayout";
import { encryptAndStore, __DEV__ } from "../../services/localStorageHelper";
import { ENCRYPT_USER } from "../../variables";

const Login = () => {
    const schema = yup.object().shape({
        username: yup.string().required("Enter your username!"),
        password: yup
            .string()
            .required("Enter your password!")
            .min(8)
    });
    const [loading, set_loading] = useState(false);
    const history = useHistory();
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register, setError } = methods;

    const onSubmit = async payload => {
        set_loading(true);
        payload.username = payload.username.toLowerCase();
        const res = await AuthServices.loginService(payload);
        const { status, data } = res;
        set_loading(false);
        if (status === 401) {
            setError("username", { type: "manual", message: data.message });
            setError("password", { type: "manual", message: "" });
        } else if (status === 200) {
            fakeAuth.authenticate();
            localStorage.setItem("loggedIn", JSON.stringify(true));
            encryptAndStore(
                ENCRYPT_USER,
                {
                    token: data.data.token,
                    expires_in: 3600,
                    user_info: data.data.user
                },
                true
            );
            return history.push(`${url}dashboard`);
        }
    };

    return (
        <motion.div
            className="login"
            initial="initial"
            animate="in"
            exit="out"
            transition={auth_pageTransitions}
            variants={auth_pageVariants}>
            <form
                className="form-login form"
                name="login-form"
                onSubmit={handleSubmit(onSubmit)}>
                <h1>Login</h1>
                <CustomInput
                    {...{
                        label: "Username",
                        name: "username",
                        placeholder: "Username",
                        defaultValue: __DEV__ ? "ezemmuo" : "",
                        errors,
                        control,
                        register
                    }}
                />
                <CustomInput
                    {...{
                        label: "Password",
                        name: "password",
                        placeholder: "Password",
                        defaultValue: __DEV__ ? "12345678" : "",
                        type: "password",
                        errors,
                        control,
                        register
                    }}
                />

                <Link to={`${url}forgot-password`} className="forgot-pw-link">
                    Forgot password?
                </Link>
                <CustomButton
                    {...{
                        loading,
                        text: "Log in",
                        onClick: handleSubmit(onSubmit)
                    }}
                />
            </form>
            <div className="new-user-container">
                <p>Don't have an account?</p>
                <Link to={`${url}register`} className="signup-link">
                    Register
                </Link>
            </div>
        </motion.div>
    );
};

export default Login;
