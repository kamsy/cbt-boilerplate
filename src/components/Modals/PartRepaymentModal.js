import React, { useState } from "react";
import { Modal, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import BankServices from "../../services/bankServices";
const { Option } = Select;

const schema = yup.object().shape({
    amount: yup.string().required("Enter the amount you want to repay!")
});

const PartRepaymentModal = ({ set_open_input_modal, open_input_modal }) => {
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
                        label: "Amount to Repay",
                        name: "amount",
                        register,
                        placeholder: "Enter amount",
                        errors,
                        control
                    }}
                />

                <CustomButton
                    {...{
                        text: "Pay Sum",
                        onClick: handleSubmit(onSubmit),
                        loading
                    }}
                />
            </form>
        </Modal>
    );
};

export default PartRepaymentModal;
