import React, { useState } from "react";
import { message } from "antd";
import { useHistory } from "react-router-dom";
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
    token: yup
        .string()
        .required("Enter reset token!")
        .length(6),
    password: yup
        .string()
        .required("Enter your password!")
        .min(8),
    confirm_password: yup
        .string()
        .required("Confirm your password!")
        .min(8)
});

const ResetPassword = () => {
    const history = useHistory();
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register, watch } = methods;

    const [loading, set_loading] = useState(false);

    const onSubmit = async payload => {
        set_loading(true);
        const res = await AuthServices.resetPasswordService(payload);
        set_loading(false);
        const { status, data } = res;
        if (status === 200) {
            message.success(data.message);
            setTimeout(() => {
                history.push(`${url}login`);
            }, 3000);
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
                <h1>Reset Password</h1>
                <p>
                    Please enter the token sent to your email and your new
                    password.
                </p>
                <CustomInput
                    {...{
                        label: "Token",
                        name: "token",
                        register,
                        placeholder: "Token",
                        errors,
                        control,
                        type: "token",
                        inputProps: {
                            maxLength: 6
                        }
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
                <CustomInput
                    {...{
                        label: "Confirm Password",
                        name: "confirm_password",
                        register,
                        placeholder: "Confirm Password",
                        errors,
                        control,
                        type: "password"
                    }}
                />

                <CustomButton
                    {...{
                        loading,
                        onClick: handleSubmit(onSubmit),
                        text: "Reset Password"
                    }}
                />
            </form>
        </motion.div>
    );
};

export default ResetPassword;
