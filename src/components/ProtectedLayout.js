import React from "react";
import "../scss/protectedlayout.scss";
import Sidebar from "./Sidebar";
import Header from "./Header";

export const pageVariants = {
    initial: {
        transformOrigin: "bottom",
        transform: "scaleY(0)"
        // transition: "0.5s all",
        // opacity: 0
    },
    in: {
        // opacity: 1,
        transform: "scaleY(1)"
    },
    out: {
        // opacity: 0,
        transform: "scaleY(0)"
    }
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
