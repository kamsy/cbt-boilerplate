import React, { useState } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { Tabs, Button, Modal } from "antd";
import "../../scss/wallet.scss";
import { usePaystackPayment } from "react-paystack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomSelect from "../../components/CustomSelect";

const { TabPane } = Tabs;

const schema = yup.object().shape({
    account_name: yup.string().required("Enter your account name!"),
    bank_name: yup.string().required("Please select a bank!")
});

const Wallet = () => {
    const config = {
        reference: new Date().getTime(),
        email: "user@example.com",
        amount: 20000,
        publicKey: "pk_test_f6f2dc3bd34ccb1e1a6f8da42cf27061767c535c"
    };
    const initializePayment = usePaystackPayment(config);

    const [open_modal, set_open_modal] = useState(false);
    const _addPane = ({ tab }) => {};
    const _renderEmptyState = tab => (
        <div className="empty-state">
            <span>
                You have not added a {tab},<br /> Click the button below to add
                a {tab}.
            </span>
            <Button
                className="custom-btn"
                onClick={() =>
                    tab === "card"
                        ? initializePayment()
                        : set_open_modal(!open_modal)
                }>
                Add {tab}
            </Button>
        </div>
    );
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register, reset } = methods;

    const onSubmit = data => {
        console.log("_addPane -> data", data);
    };

    return (
        <motion.div
            id="wallet-page"
            className="main wallet"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <div className="wallet-info-container"></div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Bank" key="1">
                    {_renderEmptyState("bank")}
                </TabPane>
                <TabPane tab="Card" key="2">
                    {_renderEmptyState("card")}
                </TabPane>
            </Tabs>
            <Modal
                getContainer={() => document.getElementById("wallet-page")}
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
                            label: "Account Name",
                            name: "account_name",
                            ref: register,
                            placeholder: "Enter account name",
                            errors,
                            control
                        }}
                    />
                    <CustomSelect
                        {...{
                            label: "Bank Name",
                            name: "bank_name",
                            ref: register,
                            placeholder: "Select a Bank",
                            errors,
                            control
                        }}
                    />

                    <CustomButton
                        text="Add Bank"
                        onClick={handleSubmit(onSubmit)}
                    />
                </form>
            </Modal>
        </motion.div>
    );
};

export default Wallet;
