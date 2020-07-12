import React, { useEffect } from "react";
import { Button } from "antd";
import CustomInput from "./CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Enter your name!")
        .min(8),
    username: yup.string().required("Enter your username!"),
    email: yup
        .string()
        .email()
        .required("Enter your email!"),
    phone: yup.string().required("Enter your phone number!")
});

const UserProfileInfo = ({ tab_key, user_info }) => {
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
            className="form-user-info form"
            name="user-info-form"
            onSubmit={handleSubmit(onSubmit)}>
            <span className="pane-sub-header">Your information.</span>
            <div className="form-inputs-container">
                <CustomInput
                    {...{
                        label: "Username",
                        name: "username",
                        register,
                        placeholder: "Username",
                        defaultValue: user_info.username,
                        errors,
                        control,
                        disabled: true
                    }}
                />
                <CustomInput
                    {...{
                        label: "Full Name",
                        name: "name",
                        register,
                        placeholder: "Enter your full name",
                        defaultValue: user_info.name,
                        errors,
                        control,
                        disabled: true
                    }}
                />
                <CustomInput
                    {...{
                        label: "Email",
                        name: "email",
                        register,
                        placeholder: "Email address",
                        defaultValue: user_info.email,
                        errors,
                        control,
                        disabled: true
                    }}
                />

                <CustomInput
                    {...{
                        label: "Phone",
                        name: "phone",
                        register,
                        placeholder: "Phone number",
                        defaultValue: user_info.phone,
                        errors,
                        control,
                        disabled: true
                    }}
                />
            </div>

            {/* <Button className="custom-btn" onClick={handleSubmit(onSubmit)}>
                Update
            </Button> */}
        </form>
    );
};

export default UserProfileInfo;
