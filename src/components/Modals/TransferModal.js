import React, { useState, useEffect } from "react";
import { Modal, Radio, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { useAnimation } from "framer";
import { motion } from "framer";
//
const { Option } = Select;
const schema_wallet = yup.object().shape({
    username: yup.string().required("Enter username!"),
    amount: yup.string().required("Enter an amount!")
});
const schema_bank = yup.object().shape({
    account_number: yup
        .string()
        .required("Enter your account number!")
        .matches(
            /^\d{10}(?!\d)$/,
            "Alaye focus!... na account number be this?😐"
        )
        .length(10),
    bank_name: yup.string().required("Please select a bank!"),
    amount: yup.string().required("Enter an amount!")
});

const TransferModal = ({
    banks,
    open_transfer_modal,
    set_open_transfer_modal,
    set_open_trans_confirm_modal
}) => {
    const [type, setType] = useState("wallet");
    console.log("type", type);
    const [paystack_bank_code, set_paystack_bank_code] = useState(null);
    const [loading, set_loading] = useState(false);

    // anim control
    const wallet_control = useAnimation();
    const bank_control = useAnimation();

    //
    const onSubmit = async payload => {
        // confirmBuyAirtime(payload);
    };

    const closeModal = () => {
        return set_open_transfer_modal(false);
    };

    const methods = useForm({
        resolver: yupResolver(type === "wallet" ? schema_wallet : schema_bank)
    });
    const {
        handleSubmit,
        control,
        errors,
        register,
        setValue,
        setError,
        clearErrors
    } = methods;

    useEffect(() => {
        clearErrors();
        if (type === "wallet") {
            wallet_control.start({
                x: 0,
                position: "relative",
                opacity: 1,
                transition: { duration: 0.5 }
            });
            bank_control.start({
                x: "+100vw",
                opacity: 0,
                position: "absolute",
                transition: { duration: 0.5 }
            });
        }
        if (type === "bank") {
            wallet_control.start({
                x: "-100vw",
                position: "absolute",
                top: 0,
                opacity: 0,
                transition: { duration: 0.5 }
            });
            bank_control.start({
                x: 0,
                position: "relative",
                opacity: 1,
                transition: { duration: 0.5 }
            });
        }
    }, [type]);

    const confirmTransfer = () => {};
    return (
        <Modal
            getContainer={() => document.querySelector(".shared-modal-comp")}
            destroyOnClose
            className="transfer-modal"
            title="Transfer"
            visible={open_transfer_modal}
            footer={null}
            onCancel={closeModal}>
            <span className="transfer-type">Transfer Type</span>
            <Radio.Group
                onChange={({ target: { value } }) => setType(value)}
                value={type}>
                <Radio value="wallet">Wallet transfer</Radio>
                <Radio value="bank">Bank transfer</Radio>
            </Radio.Group>

            <div className="anim-form-body">
                <motion.div
                    className="wallet-container"
                    animate={wallet_control}>
                    <form
                        className="form-buy-airtime form"
                        name="buy-airtimer-form"
                        onSubmit={handleSubmit(confirmTransfer)}>
                        <CustomInput
                            {...{
                                label: "Username",
                                name: "username",
                                placeholder: "Username",
                                errors,
                                control,
                                register
                            }}
                        />
                        <CustomInput
                            {...{
                                label: "Enter Amount",
                                name: "amount",
                                register,
                                placeholder: "Enter amount to recharge",
                                errors,
                                control,
                                type: "money"
                            }}
                        />
                        <CustomButton
                            {...{
                                text: "Send to Wallet",
                                extraClass: "full-size",
                                onClick: handleSubmit(confirmTransfer)
                            }}
                        />
                    </form>
                </motion.div>
                <motion.div
                    className="bank-container"
                    animate={bank_control}
                    initial={{
                        opacity: 0,
                        top: 0,
                        x: "+100vw",
                        position: "absolute"
                    }}>
                    <form
                        className="form-buy-airtime form"
                        name="buy-airtimer-form"
                        onSubmit={handleSubmit(confirmTransfer)}>
                        <div className="input-unit custom-select">
                            <Controller
                                as={
                                    <label>
                                        Bank Name
                                        <Select
                                            getPopupContainer={() =>
                                                document.querySelector(
                                                    ".layout"
                                                )
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
                                                        bank =>
                                                            bank.code === val
                                                    )[0].name
                                                );
                                                set_paystack_bank_code(val);
                                            }}>
                                            {banks?.map(
                                                ({ code, name, logo }) => {
                                                    return (
                                                        <Option
                                                            key={code}
                                                            value={code}>
                                                            <span className="bank-logo">
                                                                <img
                                                                    alt={`${name}'s logo`}
                                                                    src={logo}
                                                                />
                                                            </span>
                                                            {name}
                                                        </Option>
                                                    );
                                                }
                                            )}
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

                        <div className="looked-up-user">
                            <p></p>
                        </div>
                        <CustomInput
                            {...{
                                label: "Enter Amount",
                                name: "amount",
                                register,
                                placeholder: "Enter amount to recharge",
                                errors,
                                control,
                                type: "money"
                            }}
                        />
                        <CustomButton
                            {...{
                                text: "Send to Wallet",
                                extraClass: "full-size",
                                onClick: handleSubmit(confirmTransfer)
                            }}
                        />
                    </form>
                </motion.div>
            </div>
        </Modal>
    );
};

export default TransferModal;
