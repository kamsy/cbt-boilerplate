import React, { useEffect } from "react";
import { Button } from "antd";
import CustomInput from "./CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

const schema = yup.object().shape({
    first_name: yup
        .string()
        .required("Enter your first name!")
        .min(8),
    last_name: yup.string().required("Enter your last name!")
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
            className="form-user-info form"
            name="user-info-form"
            onSubmit={handleSubmit(onSubmit)}>
            <span className="pane-sub-header">Your information.</span>
            <div className="form-inputs-container">
                <CustomInput
                    {...{
                        label: "First Name",
                        name: "first_name",
                        ref: register,
                        placeholder: "Enter your first name",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "Last Name",
                        name: "last_name",
                        ref: register,
                        placeholder: "Enter your last name",
                        errors,
                        control
                    }}
                />
            </div>

            <Button className="custom-btn" onClick={handleSubmit(onSubmit)}>
                Update
            </Button>
        </form>
    );
};
