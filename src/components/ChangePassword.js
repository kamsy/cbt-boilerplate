import React, { useEffect } from "react";
import { Button } from "antd";
import CustomInput from "./CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

const schema = yup.object().shape({
    password: yup
        .string()
        .required("Enter your password!")
        .min(8),
    old_password: yup.string().required("Enter your old password!")
});

export default ({ tab_key }) => {
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register, reset } = methods;

    const onSubmit = data => {};

    useEffect(() => {
        reset();
    }, [tab_key, reset]);
    return (
        <form
            className="form-change-password form"
            name="change-password-form"
            onSubmit={handleSubmit(onSubmit)}>
            <span className="pane-sub-header">
                Enter your old password and new password to change it
            </span>
            <div className="form-inputs-container">
                <CustomInput
                    {...{
                        label: "Old Password",
                        name: "old_password",
                        ref: register,
                        placeholder: "Enter old password",
                        type: "password",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "New Password",
                        name: "password",
                        ref: register,
                        placeholder: "Enter new password",
                        type: "password",
                        errors,
                        control
                    }}
                />
            </div>

            <Button className="custom-btn" onClick={handleSubmit(onSubmit)}>
                Change Password
            </Button>
        </form>
    );
};
