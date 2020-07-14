import React, { useState, useEffect } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { _formatMoney, _limitText } from "../../services/utils";
import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Tabs, Button, Popconfirm } from "antd";
import { Link, useHistory } from "react-router-dom";
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
import CardServices from "../../services/cardServices";
import VisaCard from "../../assets/svgs/VisaCard";
import MasterCard from "../../assets/svgs/MasterCard";
import MicroChip from "../../assets/svgs/MicroChip";
import MomentAdapter from "@date-io/moment";

const moment = new MomentAdapter();

const { TabPane } = Tabs;

const Loans = () => {
    const history = useHistory();
    const { user_info } = decryptAndRead(ENCRYPT_USER);
    const menu = id => (
        <Menu>
            <Menu.Item
                key="1"
                onClick={() => history.push(`${url}loans/${id}`)}>
                View
            </Menu.Item>
            <Menu.Item key="2" className="green">
                Pay Full
            </Menu.Item>
            <Menu.Item key="3">Pay Part</Menu.Item>
            <Menu.Item key="4" className="red">
                Cancel Loan
            </Menu.Item>
        </Menu>
    );

    const [open_modal, set_open_modal] = useState(false);
    const [banks, set_banks] = useState([]);
    const [loans, set_loans] = useState({});
    console.log("Loans -> loans", loans);
    const [bank, set_bank] = useState({});
    const [card, set_card] = useState({});
    console.log("Loans -> card", card);
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
                set_bank(data?.bank || {});
            }
        });
    };

    const getCard = () => {
        CardServices.getCardService().then(({ status, data }) => {
            if (status === 200) {
                set_card(data?.card || {});
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
        UserServices.getWalletService().then(({ status, data }) => {
            if (status === 200) {
                set_wallet(data?.wallet || {});
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
            <AddBankModal {...{ open_modal, set_open_modal, banks, getBank }} />
            <div className="top-section">
                <div className="wallet-info-container">
                    <h3>wallet info</h3>
                    <div className="wallet-info">
                        <span>Quick Credit Wallet</span>
                        <p>{_formatMoney(wallet.amount)}</p>
                    </div>
                </div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Bank" key="1">
                        {!bank.id ? (
                            _renderEmptyState("bank")
                        ) : (
                            <div className="bank-information">
                                <div className="card">
                                    <span className="bank-name">
                                        {bank.bank_name}
                                    </span>

                                    <span className="account-num">
                                        {bank.account_number}
                                    </span>
                                </div>
                                <Popconfirm
                                    title="Are you sure you want to delete this bank?"
                                    getPopupContainer={() =>
                                        document.querySelector(
                                            ".bank-information"
                                        )
                                    }
                                    onConfirm={deleteBank}
                                    onCancel={() => {}}
                                    okText="Yes"
                                    cancelText="No">
                                    <Button className="custom-btn">
                                        Delete Bank
                                    </Button>
                                </Popconfirm>
                            </div>
                        )}
                    </TabPane>
                    <TabPane tab="Card" key="2">
                        {!card.id ? (
                            _renderEmptyState("card")
                        ) : (
                            <div className="card-information">
                                <div className="left-col">
                                    <div className="card">
                                        <span className="chip">
                                            <MicroChip />
                                        </span>
                                        <span className="last-four">
                                            **** **** **** {card.last_four}
                                        </span>
                                        <span className="brand-logo">
                                            {card.brand === "visa" ? (
                                                <VisaCard />
                                            ) : (
                                                <MasterCard />
                                            )}
                                        </span>
                                        <p>{_limitText(card.user.name, 25)}</p>
                                    </div>
                                    <Popconfirm
                                        title="Are you sure you want to delete this card?"
                                        getPopupContainer={() =>
                                            document.querySelector(
                                                ".card-information"
                                            )
                                        }
                                        onConfirm={deleteCard}
                                        onCancel={() => {}}
                                        okText="Yes"
                                        cancelText="No">
                                        <Button className="custom-btn">
                                            Delete Card
                                        </Button>
                                    </Popconfirm>
                                </div>
                                <div className="right-col">
                                    <p>
                                        <span>Bank:</span>
                                        <span>{card.bank}</span>
                                    </p>
                                    <p>
                                        <span>expiry:</span>
                                        <span>
                                            {card.month}/{card.year}
                                        </span>
                                    </p>
                                    <p>
                                        <span>Added:</span>
                                        <span>
                                            {moment
                                                .moment(
                                                    new Date(card.created_at)
                                                )
                                                .format("MMM DD, yyyy")}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </TabPane>
                </Tabs>
            </div>

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
                                        {moment
                                            .moment(new Date(due))
                                            .format("MMM DD, yyyy")}
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
                                            overlay={menu(id)}>
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
