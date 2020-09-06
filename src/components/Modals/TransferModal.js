import React, { useState, useEffect } from "react";
import { Modal, Radio, Select, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { useAnimation } from "framer";
import { motion } from "framer";
import NumberFormat from "react-number-format";
import TransferServices from "../../services/transferServices";
import { Loader } from "../Loader";
//
const { Option } = Select;
const schema_wallet = yup.object().shape({
    username: yup.string().required("Enter username!"),
    amount: yup.string().required("Enter an amount!")
});
const schema_bank = yup.object().shape({
    bank: yup.string().required("Please select a bank!"),
    amount: yup.string().required("Enter an amount!")
});

const TransferModal = ({
    banks,
    open_transfer_modal,
    set_open_transfer_modal,
    set_transaction_payload,
    set_open_trans_confirm_modal
}) => {
    const [type, setType] = useState("wallet");
    const [paystack_bank_code, set_paystack_bank_code] = useState(null);
    const [error, set_error] = useState(null);
    const [loading, set_loading] = useState(false);
    const [account_number, set_account_no] = useState("");

    // anim control
    const wallet_control = useAnimation();
    const bank_control = useAnimation();

    //

    const closeModal = () => {
        setType("wallet");
        return set_open_transfer_modal(false);
    };

    const methods = useForm({
        resolver: yupResolver(schema_wallet)
    });
    const method2 = useForm({
        resolver: yupResolver(schema_bank)
    });
    const {
        handleSubmit,
        control,
        errors,
        register,
        clearErrors,
        getValues,
        reset
    } = methods;
    const {
        handleSubmit: handleSubmit2,
        control: control2,
        errors: errors2,
        register: register2,
        setValue: setValue2,
        setError: setError2,
        clearErrors: clearErrors2,
        getValues: getValues2,
        reset: reset2
    } = method2;

    useEffect(() => {
        reset2();
        reset();
        clearErrors2();
        clearErrors();
        setValue2("bank_name", "test");
        set_paystack_bank_code(null);
        set_error(null);
        set_account_no("");
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

    const verifyAccountDetails = async ({ bank_code, account_number }) => {
        console.log(getValues(), getValues2());
        if (!bank_code || account_number.length !== 10) return;
        set_loading(true);
        const res = await TransferServices.verifyBankAccountService({
            bank_code,
            account_number
        });
        const { status, data, response } = res;
        if (response.status === 406) {
            setValue2("account_name", response.data.name);
            setError2("account_name", response.data.message);
        }
        set_loading(false);
    };

    const confirmTransfer = payload => {
        closeModal();
        set_transaction_payload({
            type: `${type}-transfer`,
            ...payload,
            account_number,
            bank_code: paystack_bank_code
        });
        set_open_trans_confirm_modal({
            open_trans_confirm_modal: true,
            type: "verify"
        });
    };

    const options = banks?.map(({ code, name, logo }) => {
        return (
            <Option key={code} value={code}>
                <span className="bank-logo">
                    <img alt={`${name}'s logo`} src={logo} />
                </span>
                {name}
            </Option>
        );
    });
    return (
        <Modal
            getContainer={() => document.querySelector(".shared-modal-comp")}
            destroyOnClose
            className="transfer-modal"
            title="Transfer"
            visible={open_transfer_modal}
            footer={null}
            onCancel={closeModal}>
            <Loader {...{ loading, tip: "Looking for account" }}>
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
                                    register,
                                    prefix: "@"
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
                            onSubmit={handleSubmit2(confirmTransfer)}>
                            <div className="input-unit custom-select">
                                <Controller
                                    render={({ value }) => {
                                        return (
                                            <label>
                                                Bank Name
                                                <Select
                                                    getPopupContainer={() =>
                                                        document.querySelector(
                                                            ".layout"
                                                        )
                                                    }
                                                    value={
                                                        value ? (
                                                            <>
                                                                <span className="bank-logo">
                                                                    <img
                                                                        alt={`${value.bank_name}'s logo`}
                                                                        src={
                                                                            value.logo
                                                                        }
                                                                    />
                                                                </span>
                                                                {
                                                                    value.bank_name
                                                                }
                                                            </>
                                                        ) : (
                                                            undefined
                                                        )
                                                    }
                                                    {...{
                                                        placeholder:
                                                            "Select a Bank"
                                                    }}
                                                    className={`form-select ${
                                                        errors2.bank_name
                                                            ?.message
                                                            ? "show-error"
                                                            : "hide-error"
                                                    }`}
                                                    showSearch
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) => {
                                                        return banks
                                                            .filter(
                                                                bank =>
                                                                    bank.code ===
                                                                    option.key
                                                            )[0]
                                                            .name.toLowerCase()
                                                            .includes(
                                                                input.toLowerCase()
                                                            );
                                                    }}
                                                    onChange={bank_code => {
                                                        setError2("bank", null);
                                                        setValue2("bank", {
                                                            bank_name: banks.filter(
                                                                bank =>
                                                                    bank.code ===
                                                                    bank_code
                                                            )[0].name,
                                                            logo: banks.filter(
                                                                bank =>
                                                                    bank.code ===
                                                                    bank_code
                                                            )[0].logo,
                                                            bank_code
                                                        });
                                                        verifyAccountDetails({
                                                            bank_code,
                                                            account_number
                                                        });
                                                        set_paystack_bank_code(
                                                            bank_code
                                                        );
                                                    }}>
                                                    {options}
                                                </Select>
                                            </label>
                                        );
                                    }}
                                    // as={}
                                    {...{
                                        name: "bank",
                                        control: control2
                                    }}
                                />
                                <p
                                    className={`form-error-text ${
                                        errors2.bank?.message ? "show" : "hide"
                                    }`}>
                                    {errors2.bank?.message}
                                </p>
                            </div>
                            <div className="input-unit">
                                <label>
                                    Account Number
                                    <NumberFormat
                                        className={`aza-input form-input ${
                                            error ? "show-error" : "hide-error"
                                        }`}
                                        customInput={Input}
                                        isNumericString
                                        value={account_number}
                                        thousandSeparator={false}
                                        maxLength={10}
                                        onValueChange={({ value }) => {
                                            set_account_no(value);
                                            set_error(null);
                                            verifyAccountDetails({
                                                bank_code: paystack_bank_code,
                                                account_number: value
                                            });
                                        }}
                                        allowNegative={false}
                                        placeholder="Enter account number"
                                    />
                                </label>
                                <p
                                    className={`form-error-text ${
                                        error ? "show" : "hide"
                                    }`}>
                                    {error}
                                </p>
                            </div>

                            <CustomInput
                                {...{
                                    label: "Account Name",
                                    name: "account_name",
                                    register: register2,
                                    errors: errors2,
                                    control: control2,
                                    disabled: true,
                                    placeholder: ""
                                }}
                            />
                            <CustomInput
                                {...{
                                    label: "Enter Amount",
                                    name: "amount",
                                    register: register2,
                                    errors: errors2,
                                    control: control2,
                                    placeholder: "Enter amount to recharge",
                                    type: "money"
                                }}
                            />
                            <CustomButton
                                {...{
                                    text: "Send to Bank",
                                    extraClass: "full-size",
                                    onClick: () => {
                                        if (account_number.length !== 10) {
                                            set_error(
                                                "Account number not valid!"
                                            );
                                        }
                                        handleSubmit2(confirmTransfer)();
                                    }
                                }}
                            />
                        </form>
                    </motion.div>
                </div>
            </Loader>
        </Modal>
    );
};

export default TransferModal;
