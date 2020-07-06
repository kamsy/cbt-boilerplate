import React, { useEffect } from "react";
import { fakeAuth, url } from "../App";
import { Link } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import Avatar from "../assets/images/person.png";
import PowerOffSvg from "../assets/svgs/PowerOffSvg";
import { clear } from "../services/localStorageHelper";
import CustomHistory from "../services/CustomHistory.js";
import ProfileUser from "../assets/svgs/ProfileUser";

const menu = (
    <Menu>
        <Menu.Item key="0">
            <Link to="/app/profile">
                <ProfileUser />
                Account
            </Link>
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item
            className="logout-btn"
            key="3"
            onClick={() => {
                fakeAuth.signout();
                clear();
                CustomHistory.push({ pathname: url });
                return window.location.reload();
            }}>
            <PowerOffSvg />
            Logout
        </Menu.Item>
    </Menu>
);
const Header = ({ title }) => {
    useEffect(() => {
        const hamburger_cont = document.querySelector(".hamburger-container");
        const hamburger1 = document.querySelector(".hamburger");
        const hamburger2 = document.querySelector(".hamburger-sb");
        const sidebar = document.querySelector(".sidebar");
        hamburger_cont.addEventListener("click", () => {
            hamburger1.classList.toggle("show");
            hamburger2.classList.toggle("show");
            sidebar.classList.toggle("show");
        });
    }, []);
    return (
        <div className="header">
            <ul className="header-list">
                <div className="hamburger-container">
                    <span className="hamburger" />
                </div>
                <span className="nav-title">{title}</span>
                <Dropdown
                    overlay={menu}
                    trigger={["click"]}
                    getPopupContainer={() => document.querySelector(".header")}>
                    <span className="ant-dropdown-link">
                        <img src={Avatar} alt="user avatar" />
                    </span>
                </Dropdown>
            </ul>
        </div>
    );
};

export default Header;
