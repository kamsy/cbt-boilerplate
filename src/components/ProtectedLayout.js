import React from "react";
import "../scss/protectedlayout.scss";
import Sidebar from "./Sidebar";
import Header from "./Header";

export const pageVariants = {
    initial: {
        transformOrigin: "bottom",
        transform: "scaleY(0)",
        transition: "2s all"
    },
    in: {
        transform: "scaleY(1)"
    },
    out: {
        transform: "scaleY(0)"
    }
};
export default ({ children }) => {
    return (
        <div className="protected-layout">
            <Header />
            <Sidebar />
            <main className="children-container">{children}</main>
        </div>
    );
};
