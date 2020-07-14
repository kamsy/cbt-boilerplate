import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { url, fakeAuth } from "../../App";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";

import { motion } from "framer";
import {
    auth_pageVariants,
    auth_pageTransitions
} from "../../components/ProtectedLayout";
import AuthServices from "../../services/authServices";
import { encryptAndStore } from "../../services/localStorageHelper";
import { ENCRYPT_USER } from "../../variables";
const schema = yup.object().shape({
    name: yup.string().required("Enter your full name!"),
    username: yup.string().required("Enter your username!"),
    email: yup
        .string()
        .email()
        .required("Enter your email!"),
    phone: yup
        .string()
        .required("Enter your phone number!")
        .matches(
            /^([0]?\d([7](?=0)|[8](?=0|1)|[9](?=0))\d{9}(?!\d))$/,
            "Alaye focus!... na 9ja number be this?😐"
        ),
    password: yup
        .string()
        .required("Enter your password!")
        .min(8)
});

const Register = () => {
    const [loading, set_loading] = useState(false);
    const history = useHistory();
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register, setError } = methods;

    const onSubmit = async payload => {
        set_loading(true);
        const res = await AuthServices.registerService(payload);
        set_loading(false);
        const { status, data } = res;
        if (status === 422) {
            const errKeys = Object.keys(data.errors);
            const valKeys = Object.values(data.errors);
            errKeys.forEach((err, i) => {
                setError(err, { type: "manual", message: valKeys[i][0] });
            });
        } else if (status === 201) {
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
            className="signup"
            initial="initial"
            animate="in"
            exit="out"
            transition={auth_pageTransitions}
            variants={auth_pageVariants}>
            <form
                className="form-register form"
                name="register-form"
                onSubmit={handleSubmit(onSubmit)}>
                <h1>Create your account</h1>

                <CustomInput
                    {...{
                        label: "Username",
                        name: "username",
                        register,
                        placeholder: "Username",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "Name",
                        name: "name",
                        register,
                        placeholder: "Full name",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "Email",
                        name: "email",
                        register,
                        placeholder: "Email address",
                        errors,
                        control
                    }}
                />

                <CustomInput
                    {...{
                        label: "Phone",
                        name: "phone",
                        register,
                        placeholder: "Phone number",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "Password",
                        name: "password",
                        register,
                        placeholder: "Password",
                        errors,
                        control,
                        type: "password"
                    }}
                />

                <CustomButton
                    {...{
                        loading,
                        text: "Register",
                        onClick: handleSubmit(onSubmit)
                    }}
                />
            </form>
            <div className="old-user-container">
                <p>Already have an account?</p>
                <Link to={`${url}login`} className="login-link">
                    Log in
                </Link>
            </div>
        </motion.div>
    );
};

export default Register;
