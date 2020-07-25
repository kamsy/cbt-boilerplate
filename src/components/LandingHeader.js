import React, { useEffect } from "react";

const LandingHeader = () => {
    useEffect(() => {
        const hamburger_cont = document.querySelector(".hamburger-container");
        const hamburger = document.querySelector(".hamburger");
        const header = document.querySelector(".landing-page-header");
        const mobile_nav = document.querySelector(".mobile-nav-container");
        const list_items = document.querySelectorAll(".mobile-list");

        const _toggleMenu = () => {
            hamburger.classList.toggle("show");
            mobile_nav.classList.toggle("show");
        };
        list_items.forEach(item => {
            item.addEventListener("click", _toggleMenu);
        });
        hamburger_cont.addEventListener("click", () => _toggleMenu());
        window.addEventListener("scroll", () => {
            const scroll_pos = window.pageYOffset;
            if (scroll_pos > 50) {
                header.classList.add("show-bg");
            } else {
                header.classList.remove("show-bg");
            }
        });
    }, []);
    const _listGen = (path, label, extraClass = "") => {
        return (
            <li className={`nav-list-item ${extraClass}`}>
                <span>
                    <a href={path} className="sidebar-link">
                        {label}
                    </a>
                </span>
            </li>
        );
    };
    return (
        <div className="landing-page-header">
            <div className="landing-page-header-sub">
                <div className="logo-cont" />
                <ul className="nav-list">
                    {_listGen("#process", "the process")}
                    {_listGen("#why-us", "why us")}
                    {_listGen("#about", "About")}
                    {_listGen("#faqs", "faqs")}
                    {_listGen("app/login", "login")}
                    {_listGen("app/register", "register")}
                </ul>
                <div className="hamburger-container">
                    <span className="hamburger" />
                </div>
                <div className="mobile-nav-container">
                    <div className="bg-1" />
                    <div className="bg-2" />
                    <div className="nav-container">
                        <ul className="nav-list">
                            {_listGen("#process", "the process", "mobile-list")}
                            {_listGen("#why-us", "why us", "mobile-list")}
                            {_listGen("#about", "About", "mobile-list")}
                            {_listGen("#faqs", "faqs", "mobile-list")}
                            {_listGen("app/login", "login", "mobile-list")}
                            {_listGen(
                                "app/register",
                                "register",
                                "mobile-list"
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingHeader;
