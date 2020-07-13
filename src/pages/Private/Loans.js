import React, { useState, useEffect } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { _formatMoney } from "../../services/utils";
import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Tabs, Button, message } from "antd";
import { Link } from "react-router-dom";
import "../../scss/loans.scss";
import { usePaystackPayment } from "react-paystack";
import { url } from "../../App";
import { decryptAndRead } from "../../services/localStorageHelper";
import { ENCRYPT_USER } from "../../variables";
import BankServices from "../../services/bankServices";
import AddBankModal from "../../components/Modals/AddBankModal";
import { NotifySuccess } from "../../components/Notification";
import UserServices from "../../services/userServices";

const { TabPane } = Tabs;

const Loans = () => {
    const { user_info } = decryptAndRead(ENCRYPT_USER);
    const menu = (
        <Menu onClick={() => {}}>
            <Menu.Item key="1">View</Menu.Item>
            <Menu.Item key="2" className="green">
                Accept
            </Menu.Item>
            <Menu.Item key="3" className="red">
                Reject
            </Menu.Item>
        </Menu>
    );

    const config = {
        reference: new Date().getTime(),
        email: user_info.email,
        amount: 5000,
        publicKey: "pk_test_f6f2dc3bd34ccb1e1a6f8da42cf27061767c535c"
    };
    const initializePayment = usePaystackPayment(config);

    const [open_modal, set_open_modal] = useState(false);
    const [banks, set_banks] = useState([]);
    const [bank, set_bank] = useState({});
    const [wallet, set_wallet] = useState({});

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
                        : (() => {
                              //   banks.length === 0 &&
                              //       BankServices.getBanksWithLogosPaystackService().then(
                              //           res => {
                              //                 console.log(
                              //                     "Loans -> status",
                              //                     status
                              //                 );
                              //                 if (status === 200) {
                              //                     set_banks(data);
                              //                 }
                              //           }
                              //       );
                              banks.length === 0 &&
                                  BankServices.getBanksFromPaystackService().then(
                                      ({ status, data: { data } }) => {
                                          if (status === 200) {
                                              set_banks(data);
                                          }
                                      }
                                  );

                              return set_open_modal(true);
                          })()
                }>
                Add {tab}
            </Button>
        </div>
    );

    const getBank = () => {
        BankServices.getBankService().then(({ status, data: { bank } }) => {
            if (status === 200) {
                set_bank(bank || {});
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

    useEffect(() => {
        getBank();
        getWallet();
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
                                <p>
                                    <span>Account Number:</span>
                                    <span>{bank.account_number}</span>
                                </p>
                                <p>
                                    <span>Bank Name:</span>
                                    <span>{bank.bank_name}</span>
                                </p>
                                <Button
                                    className="custom-btn"
                                    onClick={deleteBank}>
                                    Delete Bank
                                </Button>
                            </div>
                        )}
                    </TabPane>
                    <TabPane tab="Card" key="2">
                        {_renderEmptyState("card")}
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
                            <th>date</th>
                            <th>status</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody className="tableBody">
                        <tr>
                            <td>{_formatMoney(35000)}</td>
                            <td>3 days</td>
                            <td>{_formatMoney(40000)}</td>
                            <td>3/07/2020</td>
                            <td>
                                <span className="approve-card">approved</span>
                            </td>
                            <td id="table-dropdown" className="table-dropdown">
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
                        <tr>
                            <td>{_formatMoney(35000)}</td>
                            <td>3 days</td>
                            <td>{_formatMoney(40000)}</td>
                            <td>3/07/2020</td>
                            <td>
                                <span className="reject-card">rejected</span>
                            </td>
                            <td id="table-dropdown" className="table-dropdown">
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
                        <tr>
                            <td>{_formatMoney(35000)}</td>
                            <td>3 days</td>
                            <td>{_formatMoney(40000)}</td>
                            <td>3/07/2020</td>
                            <td>
                                <span className="pending-card">pending</span>
                            </td>
                            <td id="table-dropdown" className="table-dropdown">
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
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default Loans;
