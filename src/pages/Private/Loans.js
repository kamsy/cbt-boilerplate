import React, { useState, useEffect } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { _formatMoney } from "../../services/utils";
import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Input } from "antd";
import { Link, useHistory } from "react-router-dom";
import "../../scss/loans.scss";
import { url } from "../../App";
import LoanServices from "../../services/loanServices";
import MomentAdapter from "@date-io/moment";
import { NotifySuccess } from "../../components/Notification";
import PartRepaymentModal from "../../components/Modals/PartRepaymentModal";
const { Search } = Input;
const moment = new MomentAdapter();

const Loans = () => {
    const history = useHistory();
    const menu = ({
        id,
        approved,
        reviewed,
        repaid_loan,
        paid,
        repay_amount
    }) => (
        <Menu>
            <Menu.Item
                key="1"
                onClick={() => history.push(`${url}loans/${id}`)}>
                View
            </Menu.Item>
            {!repaid_loan && approved && reviewed && (
                <Menu.Item
                    key="2"
                    className="green"
                    onClick={() => payFullLoan(id)}>
                    Pay Full
                </Menu.Item>
            )}
            {!repaid_loan && approved && reviewed && (
                <Menu.Item
                    key="3"
                    onClick={() => openInputModal({ id, paid, repay_amount })}>
                    Pay Part
                </Menu.Item>
            )}
            {!reviewed && (
                <Menu.Item key="4" className="red">
                    Cancel Loan
                </Menu.Item>
            )}
        </Menu>
    );

    const [loans, set_loans] = useState({});
    const [open_input_modal, set_open_input_modal] = useState(false);
    const [loan_info, set_loan_info] = useState({});

    const payFullLoan = async id => {
        window._toggleLoader();
        const res = await LoanServices.payFullLoanService(id);
        console.log("Loans -> res", res);
        const { status, data } = res;
        if (status === 200) {
            setTimeout(() => {
                window._toggleLoader();
            }, 100);
            NotifySuccess(data.message);
            getLoans();
        }
    };

    const openInputModal = payload => {
        set_open_input_modal(true);
        set_loan_info(payload);
    };

    const getLoans = () => {
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        LoanServices.getLoansService().then(({ status, data }) => {
            setTimeout(() => {
                window._toggleLoader();
            }, 500);
            if (status === 200) {
                set_loans(data.loans || {});
            }
        });
    };

    useEffect(() => {
        getLoans();
    }, []);
    return (
        <motion.div
            className="main loans"
            id="loans-history"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <PartRepaymentModal
                {...{
                    loan_info,
                    set_loan_info,
                    set_open_input_modal,
                    open_input_modal,
                    getLoans
                }}
            />
            <div className="search-container">
                <Search
                    placeholder="Search loans by username or fullname"
                    size="large"
                    enterButton="search"
                    onSearch={value => console.log(value)}
                />
                <div className="link-container">
                    <Link to={`${url}create-loan`}>Request Loan</Link>
                </div>
            </div>
            <div className="table-container">
                <table className="table">
                    <thead className="table-header">
                        <tr>
                            <th>amount</th>
                            <th>duration</th>
                            <th>repayment amount</th>
                            <th>amount repaid</th>
                            <th>due date</th>
                            <th>status</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody className="tableBody">
                        {loans.data?.map(
                            ({
                                duration,
                                amount,
                                repay_amount,
                                due,
                                paid,
                                id,
                                approved,
                                rejected,
                                reviewed
                            }) => (
                                <tr key={id}>
                                    <td>{_formatMoney(amount / 100)}</td>
                                    <td>{duration} days</td>
                                    <td>{_formatMoney(repay_amount / 100)}</td>
                                    <td>{_formatMoney(paid / 100)}</td>
                                    <td>
                                        {moment
                                            .moment(new Date(due))
                                            .format("MMM DD, yyyy")}
                                    </td>
                                    <td>
                                        <span
                                            className={
                                                paid === repay_amount ||
                                                (paid > 0 &&
                                                    paid < repay_amount)
                                                    ? "paid-card"
                                                    : approved
                                                    ? "approve-card"
                                                    : rejected
                                                    ? "reject-card"
                                                    : "pending-card"
                                            }>
                                            {paid === repay_amount
                                                ? "repaid"
                                                : paid > 0 &&
                                                  paid < repay_amount
                                                ? "Repaying"
                                                : approved
                                                ? "approved"
                                                : rejected
                                                ? "rejected"
                                                : "pending"}
                                        </span>
                                    </td>
                                    <td
                                        id="table-dropdown"
                                        className="table-dropdown">
                                        <Dropdown
                                            getPopupContainer={() =>
                                                document.getElementById(
                                                    "table-dropdown"
                                                )
                                            }
                                            overlay={menu({
                                                id,
                                                approved,
                                                rejected,
                                                reviewed,
                                                repay_amount,
                                                paid,
                                                repaid_loan:
                                                    paid === repay_amount
                                            })}>
                                            <EllipsisOutlined
                                                className="ellipsis"
                                                rotate={90}
                                                style={{
                                                    fontSize: "24px"
                                                }}
                                            />
                                        </Dropdown>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default Loans;
