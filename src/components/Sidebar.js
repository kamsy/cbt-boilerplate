import React from "react";
import { url } from "../App";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const _listGen = (path, label) => {
        return (
            <li className="sidebar-list-item">
                <NavLink
                    activeClassName="active-route"
                    to={`${url}${path}`}
                    className="sidebar-link">
                    {/* {icon === "dashboard" ? (
                        <DashboardSvg />
                    ) : icon === "organizations" ? (
                        <OrganizationSvg />
                    ) : icon === "users" ? (
                        <UserProfileSvg />
                    ) : icon === "bullet" ? null : icon === "cms" ? (
                        <CMSSvg />
                    ) : icon === "decals" ? (
                        <DecalsSvg />
                    ) : icon === "roles" ? (
                        <RolesSvg />
                    ) : icon === "whitelist" ? (
                        <WhiteListSvg />
                    ) : icon === "cards" ? (
                        <SidebarCardSvg />
                    ) : icon === "reports" ? (
                        <ReportsSvg />
                    ) : icon === "audits" ? (
                        <AuditsSvg />
                    ) : (
                        <ArtworkSvg />
                    )} */}
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
