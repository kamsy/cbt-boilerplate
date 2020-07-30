import React, { useEffect } from "react";
import { url } from "../App";
import { NavLink } from "react-router-dom";
import { DashboardOutlined } from "@ant-design/icons";
import Envelope from "../assets/svgs/Envelope";
import LoanHistory from "../assets/svgs/LoanHistory";

const Sidebar = () => {
    useEffect(() => {
        const hamburger1 = document.querySelector(".hamburger");
        const hamburger_cont = document.querySelector(
            ".hamburger-container-sb"
        );
        const hamburger2 = document.querySelector(".hamburger-sb");
        const sidebar = document.querySelector(".sidebar");
        const list_items = document.querySelectorAll(".sidebar-list-item");
        list_items.forEach(item => {
            item.addEventListener("click", () => {
                hamburger1.classList.toggle("show");
                hamburger2.classList.toggle("show");
                sidebar.classList.toggle("show");
            });
        });
        hamburger_cont.addEventListener("click", () => {
            hamburger1.classList.toggle("show");
            hamburger2.classList.toggle("show");
            sidebar.classList.toggle("show");
        });
    }, []);
    const _listGen = (path, label) => {
        return (
            <li className="sidebar-list-item">
                <NavLink
                    activeClassName="active-route"
                    to={`${url}${path}`}
                    className="sidebar-link">
                    {path === "dashboard" ? (
                        <DashboardOutlined />
                    ) : path === "create-loan" ? (
                        <Envelope />
                    ) : (
                        <LoanHistory />
                    )}
                    <span className="sidebar-link-name">{label}</span>
                </NavLink>
            </li>
        );
    };
    return (
        <div className="sidebar">
            <div className="hamburger-container-sb">
                <span className="hamburger-sb" />
            </div>
            <ul className="sidebar-list">
                {_listGen("dashboard", "Dashboard")}
                {_listGen("create-loan", "Request Loan")}
                {_listGen("loans", "Loan History")}
                {_listGen("transactions", "Transactions")}
                {_listGen("wallet", "Wallet")}
                {_listGen("bills", "Bills")}
                {_listGen("profile", "Account")}
            </ul>
        </div>
    );
};

export default Sidebar;
