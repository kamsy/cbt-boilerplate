import React from "react";
import "../scss/protectedlayout.scss";

export default ({ children }) => {
    return <div className="protected-layout">{children}</div>;
};
