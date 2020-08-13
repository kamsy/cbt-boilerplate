import React, { useState } from "react";
import { Modal } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { NotifySuccess } from "../Notification";
import WalletServices from "../../services/walletServices";

const schema = yup.object().shape({
    amount: yup.string().required("Enter the amount you want to repay!")
});

const FundWalletModal = ({
    open_fund_wallet_modal,
    set_open_fund_wallet_modal,
    getWallet,
    getTransactions
}) => {
    console.log("open_fund_wallet_modal", open_fund_wallet_modal);
    const [loading, set_loading] = useState(false);
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register, reset } = methods;
    const onSubmit = async payload => {
        const amount =
            payload.amount
                .split(",")
                .join("")
                .split("₦")
                .join("") * 100;

        set_loading(true);

        const res = await WalletServices.fundWalletService({
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
