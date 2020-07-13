import React from "react";
import { Button, Spin } from "antd";

import { LoadingOutlined } from "@ant-design/icons";
const antIcon = (
    <LoadingOutlined style={{ fontSize: 20, color: "#fff" }} spin />
);
export default ({ onClick, text, loading }) => (
    <Button className="submit-btn" {...{ onClick }}>
        {!loading ? text : <Spin indicator={antIcon} />}
    </Button>
);
