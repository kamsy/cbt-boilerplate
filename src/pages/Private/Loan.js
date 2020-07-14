import React, { useState, useEffect } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { _formatMoney } from "../../services/utils";
import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Tabs, Button, Popconfirm } from "antd";
import { Link, useParams } from "react-router-dom";
import "../../scss/loan.scss";
import LoanServices from "../../services/loanServices";

import CardServices from "../../services/cardServices";
import VisaCard from "../../assets/svgs/VisaCard";
import MasterCard from "../../assets/svgs/MasterCard";
import MicroChip from "../../assets/svgs/MicroChip";
import MomentAdapter from "@date-io/moment";

const moment = new MomentAdapter();

const Loan = () => {
    const { id } = useParams();

    const [loan, set_loan] = useState({});

    const getLoan = () => {
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        LoanServices.getLoanService(id).then(({ status, data }) => {
            console.log("getLoan -> status", status);
            console.log("getLoan -> data", data);
            setTimeout(() => {
                window._toggleLoader();
            }, 500);
            if (status === 200) {
                set_loan(data.loan || {});
            }
        });
    };

    useEffect(() => {
        getLoan();
    }, []);
    return (
        <motion.div
            className="main loan"
            id="loan-history"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <h1>
                Loan Information{" "}
                <span
                    className={
                        loan.approved
                            ? "approve-card"
                            : loan.rejected
                            ? "reject-card"
                            : "pending-card"
                    }>
                    {loan.approved
                        ? "approved"
                        : loan.rejected
                        ? "rejected"
                        : "pending"}
                </span>
            </h1>
            <div className="loan-info">
                <div className="col">
                    <p>
                        <span>Loan Amount:</span>
                        <span>{_formatMoney(loan.amount / 100)}</span>
                    </p>
                    <p>
                        <span>Repayment Amount:</span>
                        <span>{_formatMoney(loan.repay_amount / 100)}</span>
                    </p>
                    <p>
                        <span>Amount Paid:</span>
                        <span>{_formatMoney(loan.paid / 100)}</span>
                    </p>
                </div>
                <div className="col">
                    <p>
                        <span>Duration :</span>
                        <span>{loan.duration} days</span>
                    </p>
                    <p>
                        <span>Request Date:</span>
                        <span>
                            {moment
                                .moment(new Date(loan.created_at))
                                .format("MMM DD, yyyy")}
                        </span>
                    </p>
                    <p>
                        <span>Due Date:</span>
                        <span>
                            {moment
                                .moment(new Date(loan.due))
                                .format("MMM DD, yyyy")}
                        </span>
                    </p>
                </div>
                <div className="col">
                    <p>
                        <span>Status:</span>
                        <span
                            className={
                                loan.approved
                                    ? "green"
                                    : loan.rejected
                                    ? "red"
                                    : "orange"
                            }>
                            {loan.approved
                                ? "approved"
                                : loan.rejected
                                ? "rejected"
                                : "pending"}
                        </span>
                    </p>
                    {loan.rejection_reason && (
                        <p>
                            <span>Rejection Reason:</span>
                            <span>{loan.rejection_reason}</span>
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Loan;
