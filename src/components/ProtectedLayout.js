import React from "react";
import "../scss/protectedlayout.scss";
import Sidebar from "./Sidebar";
import Header from "./Header";

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

export default ({ children, title }) => {
    return (
        <div className="protected-layout">
            <Header {...{ title }} />
            <Sidebar />
            <main className="children-container">{children}</main>
        </div>
    );
};
