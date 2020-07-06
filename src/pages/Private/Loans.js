import React from "react";
import { motion } from "framer";
import { pageVariants } from "../../components/ProtectedLayout";
import { _formatMoney } from "../../services/utils";
import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { Link } from "react-router-dom";
import "../../scss/loans.scss";
import { url } from "../../App";

const Loans = () => {
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

    return (
        <motion.div
            className="main loans"
            initial="initial"
            animate="in"
            exit="out"
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
                            <th>date</th>
                            <th>status</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
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
