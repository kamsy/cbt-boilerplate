import React, { useEffect } from "react";
import { Button } from "antd";
import CustomInput from "./CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import UserServices from "../services/userServices";
import * as yup from "yup";

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Enter your kin's full name!")
        .min(8),
    url: yup
        .string()
        .required("Enter any social media profile of kin!")
        .min(8),
    phone: yup
        .string()
        .required("Enter a valid phone number!")
        .matches(
            /^([0]?\d([7](?=0)|[8](?=0|1)|[9](?=0))\d{9}(?!\d))$/,
            "Alaye focus!... na 9ja number be this?😐"
        )
});

const KinInfo = ({ tab_key }) => {
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const {
        handleSubmit,
        control,
        errors,
        register,
        reset,
        setValue,
        getValues
    } = methods;

    const onSubmit = async payload => {
        window._toggleLoader();
        const res = await UserServices.addKinService(payload);
        setTimeout(() => {
            window._toggleLoader();
        }, 500);
        const {
            status,
            data: {
                kin: { name, phone, url }
            }
        } = res;
        if (status === 201) {
            setValue("name", name);
            setValue("phone", phone);
            setValue("url", url);
        }
    };

    const getKin = async () => {
        window._toggleLoader();
        const res = await UserServices.getKinService();
        setTimeout(() => {
            window._toggleLoader();
        }, 500);
        const {
            status,
            data: { kin }
        } = res;
        if (status === 200 && kin) {
            setValue("name", kin.name);
            setValue("phone", kin.phone);
            setValue("url", kin.url);
        }
    };

    useEffect(() => {
        const { name, url, phone } = getValues();
        if (name) {
            setTimeout(() => {
                setValue("name", name);
                setValue("phone", phone);
                setValue("url", url);
            }, 10);
        }
        tab_key === 2 && !name && getKin();
    }, [tab_key]);

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
                        label: "Full Name",
                        name: "name",
                        register,
                        placeholder: "Enter your kin's full name",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "Phone Number",
                        name: "phone",
                        register,
                        placeholder: "Enter your kin's phone number",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "Socail Media Url",
                        name: "url",
                        register,
                        placeholder: "Enter any of kin's social media url",
                        errors,
                        control
                    }}
                />
            </div>

            <Button className="custom-btn" onClick={handleSubmit(onSubmit)}>
                Add Kin
            </Button>
        </form>
    );
};

export default KinInfo;
