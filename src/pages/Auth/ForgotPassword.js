import React, { useState } from "react";
import { message } from "antd";
import { Link, Redirect } from "react-router-dom";
import { url } from "../../App";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";

const schema = yup.object().shape({
    email: yup
        .string()
        .email()
        .required("Enter your email!")
});

export default () => {
    const [redirectToReferrer, set_redirectToReferrer] = useState(false);
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register } = methods;

    const onSubmit = data => {
        console.log("data", data);
        setTimeout(() => {
            message.success("A reset link has been sent to your email.");
            setTimeout(() => {
                set_redirectToReferrer(true);
            }, 2000);
        }, 1500);
    };
    if (redirectToReferrer)
        return <Redirect to={{ pathname: `${url}login` }} />;
    return (
        <div className="forgot">
            <form
                className="form-forgot form"
                name="forgot-password-form"
                onSubmit={handleSubmit(onSubmit)}>
                <h1>Forgot Password</h1>
                <p>Enter your email below to reset your password.</p>
                <CustomInput
                    {...{
                        label: "Email",
                        name: "email",
                        ref: register,
                        placeholder: "Email address",
                        // defaultValue: "olekakamsy@gmail.com",
                        errors,
                        control
                    }}
                />

                <CustomButton
                    text="Reset Password"
                    onClick={handleSubmit(onSubmit)}
                />
            </form>
            <div className="new-user-container">
                <p>Remember your password?</p>
                <Link to={`${url}login`} className="login-link">
                    Log in
                </Link>
            </div>
        </div>
    );
};
