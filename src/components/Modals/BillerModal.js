import React, { useState } from "react";
import { Modal, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import BillServices from "../../services/billsServices";
import { NotifySuccess, NotifyError } from "../Notification";
const { Option } = Select;

const schema = yup.object().shape({
    phone: yup
        .string()
        .required("Enter your phone number!")
        .matches(
            /^([0]?\d([7](?=0)|[8](?=0|1)|[9](?=0))\d{9}(?!\d))$/,
            "Alaye focus!... na 9ja number be this?😐"
        ),
    bundle: yup.string().required("Please select a data bundle!")
});

const BillerModal = ({
    open_biller_modal,
    plans,
    logo,
    set_open_biller_modal,
    biller_name
}) => {
    const [loading, set_loading] = useState(false);
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
        set_loading(true);
        const { response } = await BillServices.buyDataService({
            ...payload,
            phone: `+234${payload.phone.substring(1)}`,
            amount: payload.amount * 100
        });
        set_loading(false);
        if (response) {
            const {
                status,
                data: { message }
            } = response;
            if (status === 503) {
                NotifyError(message);
            } else if (status === 406) {
                NotifyError(message);
            } else if (status === 200) {
                NotifySuccess(message);
            }
        }
    };

    return (
        <Modal
            getContainer={() => document.getElementById("bills-history")}
            destroyOnClose
            title={biller_name}
            visible={open_biller_modal}
            footer={null}
            onCancel={() => {
                reset();
                set_open_biller_modal(false);
            }}>
            <form
                className="form-biller form"
                name="biller-form"
                onSubmit={handleSubmit(onSubmit)}>
                <div className="input-unit custom-select">
                    <Controller
                        as={
                            <label>
                                Select Data Bundle
                                <Select
                                    getPopupContainer={() =>
                                        document.querySelector(".layout")
                                    }
                                    {...{
                                        placeholder: "Select a data bundle",
                                        ref: register
                                    }}
                                    className={`form-select ${
                                        errors.bundle?.message
                                            ? "show-error"
                                            : "hide-error"
                                    }`}
                                    onChange={val => {
                                        setValue(
                                            "amount",
                                            plans.filter(
                                                plan => plan.name === val
                                            )[0].amount
                                        );
                                        setValue("bundle", val);
                                    }}>
                                    {plans?.map(({ name, id }) => {
                                        return (
                                            <Option key={id} value={name}>
                                                <span className="biller-logo">
                                                    <img
                                                        src={logo}
                                                        alt={`${name} logo`}
                                                    />
                                                </span>
                                                {name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </label>
                        }
                        {...{ name: "bundle", control }}
                    />
                    <p
                        className={`form-error-text ${
                            errors.bundle?.message ? "show" : "hide"
                        }`}>
                        {errors.bundle?.message}
                    </p>
                </div>
                <CustomInput
                    {...{
                        label: "Amount",
                        name: "amount",
                        register,
                        disabled: true,
                        placeholder: "",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "Enter Phone Number",
                        name: "phone",
                        register,
                        placeholder: "Enter phone number",
                        errors,
                        control
                    }}
                />
                <CustomButton
                    {...{
                        text: "Buy Data Bundle",
                        extraClass: "full-size",
                        onClick: handleSubmit(onSubmit),
                        loading
                    }}
                />
            </form>
        </Modal>
    );
};

export default BillerModal;
