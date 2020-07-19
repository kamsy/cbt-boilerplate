import React from "react";
import CustomButton from "../components/CustomButton";

const Page500 = () => (
    <div className="error-page">
        <span className="error-text">500</span>
        <CustomButton {...{ text: "Go Home" }} />
    </div>
);

export default Page500;
