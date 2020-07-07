import React from "react";
import "../scss/protectedlayout.scss";
import Sidebar from "./Sidebar";
import Header from "./Header";

export const pageVariants = {
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

export const pageTransitions = {
    ease: "linear",
    duration: 0.2
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
