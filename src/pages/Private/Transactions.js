import React, { useState, useEffect } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { _formatMoney } from "../../services/utils";
import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Input, Pagination } from "antd";
import { Link } from "react-router-dom";
import "../../scss/transactions.scss";
import { url } from "../../App";
import LoanServices from "../../services/loanServices";
import MomentAdapter from "@date-io/moment";
import { NotifySuccess } from "../../components/Notification";
import PartRepaymentModal from "../../components/Modals/PartRepaymentModal";
import ViewLoanModal from "../../components/Modals/ViewLoanModal";
const { Search } = Input;
const moment = new MomentAdapter();

const Transactions = () => {
    const menu = ({
        id,
        approved,
        reviewed,
        repaid_loan,
        repay_amount,
        paid,
        duration,
        amount,
        rejected,
        due,
        created_at,
        rejection_reason
    }) => (
        <Menu>
            <Menu.Item key="1" onClick={() => {}}>
                View
            </Menu.Item>
            {!repaid_loan && approved && reviewed && (
                <Menu.Item key="2" className="green" onClick={() => {}}>
                    Pay Full
                </Menu.Item>
            )}
            {!repaid_loan && approved && reviewed && (
                <Menu.Item key="3" onClick={() => {}}>
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

    const [loans, set_transactions] = useState({});
    const [open_input_modal, set_open_input_modal] = useState(false);
    const [open_loan_detail_modal, set_open_loan_detail_modal] = useState(
        false
    );
    const [loan_info, set_loan_info] = useState({});

    const getTransactions = ({ page }) => {
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        LoanServices.getLoansService({ page }).then(({ status, data }) => {
            setTimeout(() => {
                window._toggleLoader();
            }, 500);
            if (status === 200) {
                set_transactions(data.loans || {});
            }
        });
    };

    const onPaginationChange = page => getTransactions({ page });

    useEffect(() => {
        getTransactions({ page: 1 });
    }, []);
    return (
        <motion.div
            className="main transactions"
            id="transactions-history"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <div className="search-container">
                <Search
                    placeholder="Search transactions by username or fullname"
                    size="large"
                    enterButton="search"
                    onSearch={value => console.log(value)}
                />
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
                                reviewed,
                                rejection_reason,
                                created_at
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
                                                    paid === repay_amount,
                                                duration,
                                                amount,
                                                due,
                                                rejection_reason,
                                                created_at
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
            <div className="pagination-container">
                <Pagination
                    total={loans.total}
                    hideOnSinglePage
                    {...{
                        onChange: onPaginationChange,
                        current: loans.current_page
                    }}
                />
            </div>
        </motion.div>
    );
};

export default Transactions;
