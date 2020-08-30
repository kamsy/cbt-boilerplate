import React from "react";
import { url } from "../App";
import { NavLink } from "react-router-dom";
import DashboardSvg from "../assets/svgs/Sidebar/DashboardSvg";
import LoanSvg from "../assets/svgs/Sidebar/LoanSvg";
import WalletSvg from "../assets/svgs/Sidebar/WalletSvg";
import BillsSvg from "../assets/svgs/Sidebar/BillsSvg";
import AccountSvg from "../assets/svgs/Sidebar/AccountSvg";
import TransactionsHistorySvg from "../assets/svgs/Sidebar/TransactionsHistorySvg";

import "../scss/sidebar.scss";

const Sidebar = () => {
    const _listGen = (path, label) => {
        return (
            <li className="sidebar-list-item">
                <NavLink
                    activeClassName="active-route"
                    to={`${url}${path}`}
                    className="sidebar-link">
                    {path === "dashboard" ? (
                        <DashboardSvg />
                    ) : path === "create-loan" ? (
                        <LoanSvg />
                    ) : path === "wallet" ? (
                        <WalletSvg />
                    ) : path === "bills" ? (
                        <BillsSvg />
                    ) : path === "profile" ? (
                        <AccountSvg />
                    ) : (
                        <TransactionsHistorySvg />
                    )}
                    <span className="sidebar-link-name">{label}</span>
                </NavLink>
            </li>
        );
    };
    return (
        <div className="sidebar">
            <ul className="sidebar-list">
                {_listGen("dashboard", "Dashboard")}
                {_listGen("create-loan", "Request Loan")}
                {_listGen("loans", "Loan History")}
                {_listGen("wallet", "Wallet")}
                {_listGen("bills", "Bills")}
                {_listGen("profile", "Account")}
            </ul>
        </div>
    );
};

export default Sidebar;
