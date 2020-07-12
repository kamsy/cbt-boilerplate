import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { url } from "../../App";
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
import { NotifyError, NotifySuccess } from "../../components/Notification";
const schema = yup.object().shape({
    name: yup.string().required("Enter your full name!"),
    username: yup.string().required("Enter your username!"),
    email: yup
        .string()
        .email()
        .required("Enter your email!"),
    phone: yup.string().required("Enter your phone number!"),
    password: yup
        .string()
        .required("Enter your password!")
        .min(8)
});

export default () => {
    const [loading, set_loading] = useState(false);
    const history = useHistory();
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register, setError } = methods;
    console.log("errors", errors);

    const onSubmit = async payload => {
        const { status, data } = await AuthServices.registerService(payload);
        console.log("Login -> data", { status, data });
        if (status === 422) {
            const errKeys = Object.keys(data.errors);
            const valKeys = Object.values(data.errors);
            errKeys.forEach((err, i) => {
                console.log("valKeys", valKeys, valKeys[i], valKeys[i][0]);
                setError(err, { type: "manual", message: valKeys[i][0] });
            });
        } else {
            // NotifySuccess;
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
                        ref: register,
                        placeholder: "Username",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "Name",
                        name: "name",
                        ref: register,
                        placeholder: "Full name",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "Email",
                        name: "email",
                        ref: register,
                        placeholder: "Email address",
                        errors,
                        control
                    }}
                />

                <CustomInput
                    {...{
                        label: "Phone",
                        name: "phone",
                        ref: register,
                        placeholder: "Phone number",
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
