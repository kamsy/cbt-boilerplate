import React, { useState } from "react";
import { Modal, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { NotifySuccess } from "../Notification";
import WalletServices from "../../services/walletServices";
import VisaCard from "../../assets/svgs/VisaCard";
import MasterCard from "../../assets/svgs/MasterCard";

const { Option } = Select;
const schema = yup.object().shape({
    amount: yup.string().required("Enter the amount you want to repay!"),
    card_id: yup.string().required("Please select a card to fund from")
});

const FundWalletModal = ({
    open_fund_wallet_modal,
    set_open_fund_wallet_modal,
    getWallet,
    getTransactions,
    cards
}) => {
    console.log("cards", cards);
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
        clearErrors
    } = methods;
    const onSubmit = async payload => {
        const amount =
            payload.amount
                .split(",")
                .join("")
                .split("₦")
                .join("") * 100;
        console.log("amount", amount);

        set_loading(true);

        const res = await WalletServices.fundWalletService({
            ...payload,
            amount
        });
        set_loading(false);
        const { status, data } = res;
        if (status === 200) {
            NotifySuccess(data.message);
            getWallet && getWallet();
            getTransactions && getTransactions({ page: 1 });
            return closeModal();
        }
    };

    const closeModal = () => {
        reset();
        return set_open_fund_wallet_modal(false);
    };

    return (
        <Modal
            getContainer={() => document.querySelector(".shared-modal-comp")}
            destroyOnClose
            title="Fund Wallet"
            visible={open_fund_wallet_modal}
            footer={null}
            onCancel={closeModal}>
            <form
                className="form form-fund-wallet"
                name="fund-wallet-form"
                onSubmit={handleSubmit(onSubmit)}>
                <div className="input-unit custom-select">
                    <Controller
                        as={
                            <label>
                                Select Card
                                <Select
                                    getPopupContainer={() =>
                                        document.querySelector(".layout")
                                    }
                                    {...{
                                        placeholder: "Select a card",
                                        ref: register
                                    }}
                                    className={`form-select ${
                                        errors.bundle?.message
                                            ? "show-error"
                                            : "hide-error"
                                    }`}
                                    onChange={val => {
                                        clearErrors("card_id");
                                        setValue("card_id", val);
                                    }}>
                                    {cards?.map(({ brand, last_four, id }) => {
                                        return (
                                            <Option key={id} value={id}>
                                                <span className="card-logo">
                                                    {brand === "visa" ? (
                                                        <VisaCard />
                                                    ) : (
                                                        <MasterCard />
                                                    )}
                                                </span>
                                                {last_four}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </label>
                        }
                        {...{ name: "card_id", control }}
                    />
                    <p
                        className={`form-error-text ${
                            errors.card_id?.message ? "show" : "hide"
                        }`}>
                        {errors.card_id?.message}
                    </p>
                </div>
                <CustomInput
                    {...{
                        label: "Amount to fund wallet with",
                        name: "amount",
                        register,
                        placeholder: "Enter amount",
                        errors,
                        control,
                        type: "money"
                    }}
                />

                <CustomButton
                    {...{
                        text: "Fund my Wallet",
                        extraClass: "full-size",
                        onClick: handleSubmit(onSubmit),
                        loading
                    }}
                />
            </form>
        </Modal>
    );
};

export default FundWalletModal;
