import React from "react";
import { url, fakeAuth } from "../App";
import { Menu, Dropdown } from "antd";
import Avatar from "../assets/images/person.png";
import PowerOffSvg from "../assets/svgs/PowerOffSvg";
import { clear } from "../services/localStorageHelper";
import CustomHistory from "../services/CustomHistory.js";

const menu = (
    <Menu>
        <Menu.Item key="0">
            <a href="#">Account</a>
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
const Header = () => {
    return (
        <div className="header">
            <ul className="header-list">
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
