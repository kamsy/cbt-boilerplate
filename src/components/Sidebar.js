import React from "react";
import { url } from "../App";
import { NavLink } from "react-router-dom";
import CreditCardSvg from "../assets/svgs/CreditCardSvg";

const Sidebar = () => {
    const _listGen = (path, label) => {
        return (
            <li className="sidebar-list-item">
                <NavLink
                    activeClassName="active-route"
                    to={`${url}${path}`}
                    className="sidebar-link">
                    {path === "dashboard" ? (
                        <CreditCardSvg />
                    ) : path === "organizations" ? (
                        <CreditCardSvg />
                    ) : (
                        <CreditCardSvg />
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
                {_listGen("loans", "Loans")}
                {_listGen("payment", "Payment")}
            </ul>
        </div>
    );
};

export default Sidebar;
