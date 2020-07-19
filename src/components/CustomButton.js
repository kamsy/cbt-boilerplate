import React from "react";
import { Button, Spin } from "antd";

import { LoadingOutlined } from "@ant-design/icons";
const antIcon = (
    <LoadingOutlined style={{ fontSize: 20, color: "#fff" }} spin />
);
const CustomButton = ({ onClick, text, loading, extraClass = "" }) => (
    <Button className={`submit-btn ${extraClass}`} {...{ onClick }}>
        {!loading ? text : <Spin indicator={antIcon} />}
    </Button>
);

export default CustomButton;
