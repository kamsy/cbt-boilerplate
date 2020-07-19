import React from "react";
import { Modal } from "antd";
import CustomButton from "../CustomButton";
import MomentAdapter from "@date-io/moment";
import { _formatMoney } from "../../services/utils";

const moment = new MomentAdapter();
const ViewLoanModal = ({
    open_loan_detail_modal,
    set_open_loan_detail_modal,
    loan_info: {
        id,
        approved,
        reviewed,
        repaid_loan,
        repay_amount,
        paid,
        duration,
        amount,
        due,
        rejected,
        rejection_reason,
        created_at
    },
    set_loan_info,
    payFullLoan,
    openInputModal
}) => {
    const closeModal = () => {
        set_open_loan_detail_modal(false);
        set_loan_info({});
    };
    const handleCancelLoan = () => {
        closeModal();
    };
    const handlePayPartLoan = () => {
        closeModal();
        return openInputModal({ id, repay_amount, paid });
    };
    const handlePayFullLoan = () => {
        payFullLoan(id);
        closeModal();
    };

    return (
        <Modal
            getContainer={() => document.getElementById("loans-history")}
            className="view-loan-modal"
            destroyOnClose
            title={`Loan #${id}`}
            visible={open_loan_detail_modal}
            footer={null}
            onCancel={closeModal}>
            <div className="col">
                <h1>
                    <span>Status:</span>

                    <span
                        className={
                            repaid_loan || (paid > 0 && paid < repay_amount)
                                ? "paid-card"
                                : approved
                                ? "approve-card"
                                : rejected
                                ? "reject-card"
                                : "pending-card"
                        }>
                        {repaid_loan
                            ? "repaid"
                            : paid > 0 && paid < repay_amount
                            ? "Repaying"
                            : approved
                            ? "approved"
                            : rejected
                            ? "rejected"
                            : "pending"}
                    </span>
                </h1>
                {rejection_reason && (
                    <p className="rejection-reason">
                        <span>Rejection Reason:</span>
                        <span>{rejection_reason}</span>
                    </p>
                )}
            </div>

            <p>
                <span>Loan Amount:</span>
                <span>{_formatMoney(amount / 100)}</span>
            </p>
            <p>
                <span>Repayment Amount:</span>
                <span>{_formatMoney(repay_amount / 100)}</span>
            </p>
            <p>
                <span>Amount Paid:</span>
                <span>{_formatMoney(paid / 100)}</span>
            </p>
            <p>
                <span>Duration :</span>
                <span>{duration} days</span>
            </p>
            <p>
                <span>Request Date:</span>
                <span>
                    {moment.moment(new Date(created_at)).format("MMM DD, yyyy")}
                </span>
            </p>
            <p>
                <span>Due Date:</span>
                <span>
                    {moment.moment(new Date(due)).format("MMM DD, yyyy")}
                </span>
            </p>

            {paid !== repay_amount && approved && reviewed && (
                <>
                    <CustomButton
                        {...{
                            text: "Pay Part",
                            onClick: handlePayPartLoan,

                            extraClass: "invert-bg half-size"
                        }}
                    />
                    <CustomButton
                        {...{
                            text: "Part Full",
                            onClick: handlePayFullLoan,

                            extraClass: "half-size"
                        }}
                    />
                </>
            )}
            {!reviewed && (
                <CustomButton
                    {...{
                        text: "Cancel Loan",
                        onClick: handleCancelLoan,

                        extraClass: "red-bg full-size"
                    }}
                />
            )}
        </Modal>
    );
};

export default ViewLoanModal;
