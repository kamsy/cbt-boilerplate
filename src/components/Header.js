import React, { useEffect } from "react";
import { fakeAuth, url } from "../App";
import { Link, useHistory, useParams } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import Avatar from "../assets/images/person.png";
import PowerOffSvg from "../assets/svgs/PowerOffSvg";
import { clear } from "../services/localStorageHelper";
import ProfileUser from "../assets/svgs/ProfileUser";

const Header = ({ title }) => {
    const history = useHistory();
    console.log("Header -> history", history);
    const params = useParams();
    console.log("Header -> params", params);
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
                <div className="hamburger-container">
                    <span className="hamburger" />
                </div>
                <span className="nav-title">
                    {history.location.pathname.includes(params.id)
                        ? `${title} #${params.id}`
                        : title}
                </span>
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
