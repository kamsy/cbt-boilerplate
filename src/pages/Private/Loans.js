import React, { useState } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { _formatMoney } from "../../services/utils";
import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Tabs, Button, Modal } from "antd";
import { Link } from "react-router-dom";
import "../../scss/loans.scss";
import { usePaystackPayment } from "react-paystack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import { url } from "../../App";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import CustomSelect from "../../components/CustomSelect";
import { decryptAndRead } from "../../services/localStorageHelper";
import { ENCRYPT_USER } from "../../variables";
import BankServices from "../../services/bankServices";

const { TabPane } = Tabs;

const schema = yup.object().shape({
    account_number: yup
        .string()
        .required("Enter your account number!")
        .min(10),

    bank_name: yup.string().required("Please select a bank!")
});

const Loans = () => {
    const { user_info } = decryptAndRead(ENCRYPT_USER);
    console.log("Wal -> user_info", user_info);
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
        email: "user@example.com",
        amount: 20000,
        publicKey: "pk_test_f6f2dc3bd34ccb1e1a6f8da42cf27061767c535c"
    };
    const initializePayment = usePaystackPayment(config);

    const [open_modal, set_open_modal] = useState(false);
    console.log("Loans -> open_modal", open_modal);
    const [banks, set_banks] = useState([]);

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
                              fetch("https://nigerianbanks.xyz", {
                                  headers: {
                                      "Access-Control-Allow-Origin": "*",
                                      "Content-Type": "application/json"
                                  }
                              }).then(res => {
                                  console.log("Loans -> res", res);
                              });
                              //   BankServices.getBanksWithLogosPaystackService().then(
                              //       res => {
                              //           console.log("Loans -> res", res);
                              //       }
                              //   );
                              //   BankServices.getBanksFromPaystackService().then(
                              //       ({ status, data: { data } }) => {
                              //           console.log("Loans -> status", status);
                              //           console.log("Loans -> data", data);
                              //           if (status === 200) {
                              //               set_banks(data);
                              //           }
                              //       }
                              //   );
                              return set_open_modal(true);
                          })()
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
            className="main loans"
            id="loans-history"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <div className="top-section">
                <div className="wallet-info-container">
                    <h3>wallet info</h3>
                    <div className="wallet-info">
                        <span>Quick Credit Wallet</span>
                        <p>{_formatMoney(user_info.wallet.amount)}</p>
                    </div>
                </div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Bank" key="1">
                        {_renderEmptyState("bank")}
                    </TabPane>
                    <TabPane tab="Card" key="2">
                        {_renderEmptyState("card")}
                    </TabPane>
                </Tabs>
            </div>
            <Modal
                getContainer={() => document.getElementById("loans-history")}
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
                            label: "Account Number",
                            name: "account_number",
                            register,
                            placeholder: "Enter account number",
                            errors,
                            control
                        }}
                    />
                    <CustomSelect
                        {...{
                            label: "Bank Name",
                            name: "bank_name",
                            register,
                            placeholder: "Select a Bank",
                            errors,
                            control,
                            options: banks
                        }}
                    />

                    <CustomButton
                        text="Add Bank"
                        onClick={handleSubmit(onSubmit)}
                    />
                </form>
            </Modal>

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
