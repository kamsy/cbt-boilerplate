import React, { useEffect } from "react";
import { Button } from "antd";
import CustomInput from "./CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomSelect from "./CustomSelect";
import UserServices from "../services/userServices";

const schema = yup.object().shape({
    address: yup.string().required("Enter your house address!"),
    duration: yup.string().required("Enter the duration at address!"),
    type: yup.string().required("Select your accomodation type!")
});

const AddressInfo = ({ tab_key }) => {
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const {
        handleSubmit,
        control,
        errors,
        register,
        reset,
        setValue
    } = methods;

    const onSubmit = async payload => {
        window._toggleLoader();
        const res = await UserServices.addAddressService({
            ...payload,
            duration: Number(payload.duration)
        });
        setTimeout(() => {
            window._toggleLoader();
        }, 500);
        const { status, data } = res;
        if (status === 201) {
            setValue("address", data.address.address);
            setValue("type", data.address.type);
            setValue("duration", data.address.duration);
        }
    };

    const getAddress = async () => {
        window._toggleLoader();
        const res = await UserServices.getAddressService();
        setTimeout(() => {
            window._toggleLoader();
        }, 500);
        const { status, data } = res;
        if (status === 200) {
            setValue("address", data.address.address);
            setValue("type", data.address.type);
            setValue("duration", data.address.duration);
        }
    };

    useEffect(() => {
        tab_key === 3 && getAddress();
    }, [tab_key]);

    useEffect(() => {
        reset();
    }, [tab_key, reset]);
    return (
        <form
            className="form-change-password form"
            name="change-password-form"
            onSubmit={handleSubmit(onSubmit)}>
            <span className="pane-sub-header">Your address information.</span>
            <div className="form-inputs-container">
                <CustomInput
                    {...{
                        label: "Address",
                        name: "address",
                        register,
                        placeholder: "Enter your house address",
                        errors,
                        control
                    }}
                />

                <CustomSelect
                    {...{
                        label: "Accomodation Type",
                        name: "type",
                        register,
                        placeholder: "Select your accomodation type",
                        errors,
                        control,
                        options: [
                            { key: 0, value: "owner", name: "Owned" },
                            { key: 1, value: "family", name: "Family" },
                            { key: 2, value: "rent", name: "Rent" },
                            { key: 3, value: "others", name: "Others" }
                        ]
                    }}
                />

                <CustomInput
                    {...{
                        label: "Duration at Address (years)",
                        name: "duration",
                        register,
                        placeholder: "Enter your duration at current address",
                        errors,
                        control,
                        type: "number"
                    }}
                />
            </div>

            <Button className="custom-btn" onClick={handleSubmit(onSubmit)}>
                Submit
            </Button>
        </form>
    );
};

export default AddressInfo;
