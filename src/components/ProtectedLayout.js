import React, { useEffect } from "react";
import "../scss/protectedlayout.scss";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const antIcon = (
    <LoadingOutlined style={{ fontSize: 20, color: "#fff" }} spin />
);

const pageVariants = {
    initial: {
        y: "+100vh",
        opacity: 0
    },
    in: {
        y: 0,
        opacity: 1
    },
    out: {
        opacity: 0,
        y: "+100vh"
    }
};

const auth_pageVariants = {
    initial: {
        opacity: 0
    },
    in: {
        opacity: 1
    },
    out: {
        opacity: 0
    }
};

const pageTransitions = {
    ease: "linear",
    duration: 0.4
};

const auth_pageTransitions = {
    ease: "linear",
    duration: 1
};

export {
    pageVariants,
    auth_pageVariants,
    pageTransitions,
    auth_pageTransitions
};

const ProtectedLayout = ({ children, title }) => {
    useEffect(() => {
        window._toggleLoader = () =>
            document.querySelector(".window-loader").classList.toggle("show");
    }, []);
    return (
        <div className="protected-layout layout">
            <Spin indicator={antIcon} className="window-loader" />
            <Header {...{ title }} />
            <Sidebar />
            <main className="children-container">{children}</main>
        </div>
    );
};

export default ProtectedLayout;
