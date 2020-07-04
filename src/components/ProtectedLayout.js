import React from "react";
import "../scss/protectedlayout.scss";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default ({ children }) => {
    return (
        <div className="protected-layout">
            <Header />
            <Sidebar />
            <main className="main">{children}</main>
        </div>
    );
};
