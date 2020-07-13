import React, { useState, useEffect } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { _formatMoney, _limitText } from "../../services/utils";
import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Tabs, Button, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import "../../scss/loans.scss";
import { PaystackConsumer } from "react-paystack";
import { url } from "../../App";
import { decryptAndRead } from "../../services/localStorageHelper";
import { ENCRYPT_USER } from "../../variables";
import BankServices from "../../services/bankServices";
import AddBankModal from "../../components/Modals/AddBankModal";
import { NotifySuccess } from "../../components/Notification";
import UserServices from "../../services/userServices";
import LoanServices from "../../services/loanServices";
import format from "date-fns/format";
import CardServices from "../../services/cardServices";
import VisaCard from "../../assets/svgs/VisaCard";
import MasterCard from "../../assets/svgs/MasterCard";
import MicroChip from "../../assets/svgs/MicroChip";

const { TabPane } = Tabs;

const Loans = () => {
    const { user_info } = decryptAndRead(ENCRYPT_USER);
    const menu = (
        <Menu onClick={() => {}}>
            <Menu.Item key="1">View</Menu.Item>
            <Menu.Item key="3" className="red">
                Cancel Loan
            </Menu.Item>
            <Menu.Item key="2" className="green">
                Pay Full
            </Menu.Item>
            <Menu.Item key="3">Pay Part</Menu.Item>
        </Menu>
    );

    const [open_modal, set_open_modal] = useState(false);
    const [banks, set_banks] = useState([]);
    const [loans, set_loans] = useState({});
    const [bank, set_bank] = useState({});
    const [card, set_card] = useState({});
    const [wallet, set_wallet] = useState({});

    const componentProps = {
        reference: `q_c_ng_card_ref_${new Date().getTime()}`,
        email: user_info.email,
        amount: 5000,
        publicKey: "pk_test_36fc18e976546bd2549c78c2dc7e97d8ee014144",
        onSuccess: ({ reference }) => {
            window._toggleLoader();
            CardServices.verifyCardService(reference).then(
                ({ status, data }) => {
                    if (status === 201) {
                        set_card(data.card);
                    }
                    setTimeout(() => {
                        window._toggleLoader();
                    }, 500);
                }
            );
        },
        onClose: e => console.log(e)
    };

    const _renderEmptyState = tab => (
        <div className="empty-state">
            <span>
                You have not added a {tab},<br /> Click the button below to add
                a {tab}.
            </span>
            {tab === "card" ? (
                <PaystackConsumer {...componentProps}>
                    {({ initializePayment }) => (
                        <Button
                            className="custom-btn"
                            onClick={initializePayment}>
                            Add Card
                        </Button>
                    )}
                </PaystackConsumer>
            ) : (
                <Button
                    className="custom-btn"
                    onClick={() => {
                        banks.length === 0 &&
                            BankServices.getBanksWithLogosPaystackService().then(
                                ({ status, data }) => {
                                    if (status === 200) {
                                        set_banks(data);
                                    }
                                }
                            );

                        return set_open_modal(true);
                    }}>
                    Add Bank
                </Button>
            )}
        </div>
    );

    const getBank = () => {
        BankServices.getBankService().then(({ status, data }) => {
            if (status === 200) {
                set_bank(data.bank || {});
            }
        });
    };

    const getCard = () => {
        CardServices.getCardService().then(({ status, data }) => {
            if (status === 200) {
                set_card(data.card || {});
            }
        });
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

    const getWallet = () => {
        UserServices.getWalletService().then(({ status, data: { wallet } }) => {
            if (status === 200) {
                set_wallet(wallet || {});
            }
        });
    };

    const deleteBank = async () => {
        window._toggleLoader();
        const res = await BankServices.deleteBankService();
        setTimeout(() => {
            window._toggleLoader();
        }, 500);
        const { status, data } = res;
        if (status === 200) {
            NotifySuccess(data.message);
            set_bank({});
        }
    };

    const deleteCard = async () => {
        window._toggleLoader();
        const res = await CardServices.deleteCardService();
        setTimeout(() => {
            window._toggleLoader();
        }, 500);
        const { status, data } = res;
        if (status === 200) {
            NotifySuccess(data.message);
            set_card({});
        }
    };

    useEffect(() => {
        getCard();
        getBank();
        getWallet();
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
            <div className="link-container">
                <Link to={`${url}create-loan`}>Request Loan</Link>
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
                                rejected
                            }) => (
                                <tr key={id}>
                                    <td>{_formatMoney(amount / 100)}</td>
                                    <td>{duration} days</td>
                                    <td>{_formatMoney(repay_amount / 100)}</td>
                                    <td>{_formatMoney(paid / 100)}</td>
                                    <td>
                                        {format(new Date(due), "MMM dd, yyyy")}
                                    </td>
                                    <td>
                                        <span
                                            className={
                                                approved
                                                    ? "approve-card"
                                                    : rejected
                                                    ? ""
                                                    : "pending-card"
                                            }>
                                            {approved
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
                                            overlay={menu}>
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
