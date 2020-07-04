import React from "react";
import "../scss/authlayout.scss";

export default ({ children }) => {
    // useEffect(() => {
    //     const submit_btns = document.querySelectorAll(".submit-btn");
    //     console.log("submit_btns", submit_btns);
    //     submit_btns.forEach(btn => {
    //         btn.addEventListener("mouseover", () => {
    //             btn.classList.add("mouse-over");
    //         });
    //         btn.addEventListener("click", () => {
    //             btn.classList.add("mouse-click");
    //         });
    //         btn.addEventListener("mouseout", () => {
    //             btn.classList.remove("mouse-over");
    //             btn.classList.remove("mouse-click");
    //         });
    //     });
    // }, []);
    return <div className="auth-layout">{children}</div>;
};
