import React from "react";
import { Button } from "antd";

export default ({ onClick, text }) => (
    <Button className="submit-btn" {...{ onClick }}>
        {text}
    </Button>
);
