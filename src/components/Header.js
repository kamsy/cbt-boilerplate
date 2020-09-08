import React, { useEffect, useState } from "react";
import { fakeAuth, url } from "../App";
import { Link, useHistory } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import Avatar from "../assets/images/person.png";
import PowerOffSvg from "../assets/svgs/PowerOffSvg";
import { clear, decryptAndRead } from "../services/localStorageHelper";
import ProfileUser from "../assets/svgs/ProfileUser";
import "../scss/header.scss";
import { ENCRYPT_USER } from "../variables";
import UpdatePinModal from "./Modals/UpdatePinModal";
const Header = () => {
    const { user_info } = decryptAndRead(ENCRYPT_USER);
    const history = useHistory();
    const [open_update_pin_modal, set_open_update_pin_modal] = useState(false);
    const toggleUpdatePINModal = () =>
        set_open_update_pin_modal(!open_update_pin_modal);
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
            <Menu.Item key="10">
                <div className="user-info">
                    <p>{user_info.name}</p>
                    <span>{`@${user_info.username}`}</span>
                </div>
            </Menu.Item>
            <Menu.Item key="0">
                <Link to="/app/profile">
                    <ProfileUser />
                    Account
                </Link>
            </Menu.Item>
            <Menu.Item key="2" onClick={toggleUpdatePINModal}>
                Change PIN
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
            <UpdatePinModal
                {...{
                    closeModal: toggleUpdatePINModal,
                    open_update_pin_modal
                }}
            />
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
