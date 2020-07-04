import React from "react";
import "../scss/protectedlayout.scss";
import Sidebar from "./Sidebar";

export default ({ children }) => {
    return (
        <div className="protected-layout">
            <Sidebar />
            <main className="main">{children}</main>
        </div>
    );
};
