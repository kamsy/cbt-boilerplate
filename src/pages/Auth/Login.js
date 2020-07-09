import React from "react";
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

const schema = yup.object().shape({
    username: yup.string().required("Enter your username!"),
    password: yup
        .string()
        .required("Enter your password!")
        .min(8)
});

export default () => {
    const history = useHistory();
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register } = methods;

    const onSubmit = data => {
        fakeAuth.authenticate();
        localStorage.setItem("loggedIn", JSON.stringify(true));
        return history.push(`${url}dashboard`);
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
                <CustomButton text="Log in" onClick={handleSubmit(onSubmit)} />
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
