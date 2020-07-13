import React, { useState } from "react";
import { Modal, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import BankServices from "../../services/bankServices";
import { NotifySuccess } from "../Notification";
const { Option } = Select;

const schema = yup.object().shape({
    account_number: yup
        .string()
        .required("Enter your account number!")
        .min(10),

    bank_name: yup.string().required("Please select a bank!")
});

const AddBankModal = ({ set_open_modal, open_modal, banks, getBank }) => {
    const [paystack_bank_code, set_paystack_bank_code] = useState(null);
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
        setValue,
        setError
    } = methods;

    const onSubmit = async payload => {
        set_loading(true);
        const res = await BankServices.addBankService({
            ...payload,
            paystack_bank_code
        });
        setTimeout(() => {
            set_loading(false);
        }, 500);
        if (res.status === 201) {
            getBank();
            return set_open_modal(false);
        }
    };

    return (
        <Modal
            getContainer={() => document.getElementById("loans-history")}
            destroyOnClose
            title="Add Bank"
            visible={open_modal}
            footer={null}
            onCancel={() => {
                reset();
                set_open_modal(false);
            }}>
            <form
                className="form-add-bank form"
                name="add-bank-form"
                onSubmit={handleSubmit(onSubmit)}>
                <CustomInput
                    {...{
                        label: "Account Number",
                        name: "account_number",
                        register,
                        placeholder: "Enter account number",
                        errors,
                        control
                    }}
                />
                <div className="input-unit custom-select">
                    <Controller
                        as={
                            <label>
                                Bank Name
                                <Select
                                    getPopupContainer={() =>
                                        document.querySelector(".layout")
                                    }
                                    {...{
                                        placeholder: "Select a Bank",
                                        ref: register
                                    }}
                                    className={`form-select ${
                                        errors.bank_name?.message
                                            ? "show-error"
                                            : "hide-error"
                                    }`}
                                    onChange={val => {
                                        setError("bank_name", null);
                                        setValue(
                                            "bank_name",
                                            banks.filter(
                                                bank => bank.code === val
                                            )[0].name
                                        );
                                        set_paystack_bank_code(val);
                                    }}>
                                    {banks?.map(({ code, name, slug }) => {
                                        return (
                                            <Option key={code} value={code}>
                                                <span className="bank-logo">
                                                    {/* <img
                                                alt={`${name}'s logo`}
                                                src={`https://nigerianbanks.xyz/logo/${slug}.png`}
                                            /> */}
                                                </span>
                                                {name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </label>
                        }
                        {...{ name: "bank_name", control }}
                    />
                    <p
                        className={`form-error-text ${
                            errors.bank_name?.message ? "show" : "hide"
                        }`}>
                        {errors.bank_name?.message}
                    </p>
                </div>

                <CustomButton
                    {...{
                        text: "Add Bank",
                        onClick: handleSubmit(onSubmit),
                        loading
                    }}
                />
            </form>
        </Modal>
    );
};

export default AddBankModal;
