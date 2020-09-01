import React, { useEffect } from "react";
import { fakeAuth, url } from "../App";
import { Link, useHistory } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import Avatar from "../assets/images/person.png";
import PowerOffSvg from "../assets/svgs/PowerOffSvg";
import { clear, decryptAndRead } from "../services/localStorageHelper";
import ProfileUser from "../assets/svgs/ProfileUser";
import Logo from "../assets/images/Logo.png";
import "../scss/header.scss";
import { ENCRYPT_USER } from "../variables";
const Header = () => {
    const { user_info } = decryptAndRead(ENCRYPT_USER);
    console.log("Header -> user_info", user_info);
    const history = useHistory();
    useEffect(() => {
        const hamburger_cont = document.querySelector(".hamburger-container");
        const hamburger1 = document.querySelector(".hamburger");
        const sidebar = document.querySelector(".sidebar");
        hamburger_cont.addEventListener("click", () => {
            hamburger1.classList.toggle("show");
            sidebar.classList.toggle("show");
        });
    }, []);
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
                key="1"
                onClick={() => {
                    clear();
                    fakeAuth.signout();
                    return history.push({ pathname: `${url}login` });
                }}>
                <PowerOffSvg />
                Logout
            </Menu.Item>
        </Menu>
    );
    return (
        <div className="header">
            <ul className="header-list">
                <div className="logo-cont">
                    <div className="hamburger-container">
                        <span className="hamburger" />
                    </div>
                    {/* <img
                        src={Logo}
                        alt="quick's credit logo"
                        className="logo"
                    /> */}
                    <h3 className="comp-name">QuickCredit</h3>
                </div>

                <Dropdown
                    overlay={menu}
                    trigger={["click"]}
                    getPopupContainer={() => document.querySelector(".header")}>
                    <span className="ant-dropdown-link">
                        <div className="avatar-cont">
                            <img src={Avatar} alt="user avatar" />
                        </div>
                        <div className="user-info">
                            <p>{user_info.name}</p>
                            <span>{`@${user_info.username}`}</span>
                        </div>
                    </span>
                </Dropdown>
            </ul>
        </div>
    );
};

export default Header;
