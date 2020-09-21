import React, { useState } from "react";
import { Modal } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { NotifySuccess } from "../Notification";
import LoanServices from "../../services/loanServices";
import { _formatMoney, _currencyToInteger } from "../../services/utils";

const schema = yup.object().shape({
    amount: yup.string().required("Enter the amount you want to repay!")
});

const PartRepaymentModal = ({
    set_open_input_modal,
    open_input_modal,
    getLoans,
    set_loan_info,
    loan_info
}) => {
    const { paid, id, repay_amount } = loan_info;
    const balance = repay_amount - paid;
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
        setError
    } = methods;

    const onSubmit = async payload => {
        const amount = _currencyToInteger(payload.amount);

        if (amount > balance) {
            return setError("amount", {
                type: "manual",
                message: "Amount is greater than what you owe"
            });
        }
        set_loading(true);

        const res = await LoanServices.payPartLoanService({
            id,
            amount
        });
        const { status, data } = res;
        if (status === 200) {
            NotifySuccess(data.message);
            getLoans({ page: 1 });
            return closeModal();
        }
    };

    const closeModal = () => {
        reset();
        set_loan_info({});
        return set_open_input_modal(false);
    };

    return (
        <Modal
            getContainer={() => document.getElementById("loans-history")}
            destroyOnClose
            title="Repay Loan"
            visible={open_input_modal}
            footer={null}
            onCancel={closeModal}>
            <form
                className="form form-repay-loan"
                name="repay-loan-form"
                onSubmit={handleSubmit(onSubmit)}>
                <span>Amount to pay:</span>
                <p className="amount-owed">{_formatMoney(balance / 100)}</p>

                <CustomInput
                    {...{
                        label: "Amount to Repay",
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
