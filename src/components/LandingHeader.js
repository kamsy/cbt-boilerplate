import React from "react";
import { Link } from "react-router-dom";
const _listGen = (path, label) => {
    return (
        <li className="nav-list-item">
            <Link to={path} className="sidebar-link">
                {label}
            </Link>
        </li>
    );
};
export default () => {
    return (
        <div className="landing-page-header">
            <div className="landing-page-header-sub">
                <div className="logo-cont" />
                <ul className="nav-list">
                    {_listGen("/#/process", "the process")}
                    {_listGen("/#/why-us", "why us")}
                    {_listGen("/#/about", "About")}
                    {_listGen("/#/faqs", "faqs")}
                    {_listGen("/app/login", "login")}
                    {_listGen("/app/register", "register")}
                </ul>
            </div>
        </div>
    );
};
