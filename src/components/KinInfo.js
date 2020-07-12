import React, { useEffect } from "react";
import { Button } from "antd";
import CustomInput from "./CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

const schema = yup.object().shape({
    first_name: yup
        .string()
        .required("Enter your kin's first name!")
        .min(8),
    last_name: yup.string().required("Enter your kin's last name!")
});

export default ({ tab_key, kin }) => {
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
            <span className="pane-sub-header">Next of Kin information.</span>
            <div className="form-inputs-container">
                <CustomInput
                    {...{
                        label: "First Name",
                        name: "first_name",
                        register,
                        placeholder: "Enter your kin's first name",
                        errors,
                        control,
                        disabled: true
                    }}
                />
                <CustomInput
                    {...{
                        label: "Last Name",
                        name: "last_name",
                        register,
                        placeholder: "Enter your kin's last name",
                        errors,
                        control,
                        disabled: true
                    }}
                />
            </div>

            <Button className="custom-btn" onClick={handleSubmit(onSubmit)}>
                Add Kin
            </Button>
        </form>
    );
};
