import React, { useState } from "react";
import { message } from "antd";
import { Link, useHistory } from "react-router-dom";
import { url } from "../../App";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { motion } from "framer";
import {
    auth_pageVariants,
    auth_pageTransitions
} from "../../components/ProtectedLayout";
import AuthServices from "../../services/authServices";
const schema = yup.object().shape({
    email: yup
        .string()
        .email()
        .required("Enter your email!")
});

const ForgotPassword = () => {
    const history = useHistory();
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register } = methods;
    const [loading, set_loading] = useState(false);

    const onSubmit = async payload => {
        set_loading(true);
        const res = await AuthServices.forgotPasswordService(payload);
        set_loading(false);
        const { status, data } = res;
        if (status === 200) {
            message.success(data.message);
            history.push(`${url}reset-password`);
        } else {
            message.error(data.message);
        }
    };
    return (
        <motion.div
            className="forgot"
            initial="initial"
            animate="in"
            exit="out"
            transition={auth_pageTransitions}
            variants={auth_pageVariants}>
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
                        register,
                        placeholder: "Email address",
                        errors,
                        control
                    }}
                />

                <CustomButton
                    {...{
                        loading,
                        onClick: handleSubmit(onSubmit),
                        text: "Send Token"
                    }}
                />
            </form>
            <div className="new-user-container">
                <p>Remember your password?</p>
                <Link to={`${url}login`} className="login-link">
                    Log in
                </Link>
            </div>
        </motion.div>
    );
};

export default ForgotPassword;
