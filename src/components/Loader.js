import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const antIcon = (
    <LoadingOutlined style={{ fontSize: 20, color: "#fff" }} spin />
);
export const Loader = ({
    tip = "Please wait...",
    className,
    loading,
    children
}) => (
    <Spin
        spinning={loading}
        tip={tip}
        className={className}
        indicator={antIcon}>
        {children}
    </Spin>
);

Loader.propTypes = {
    loading: PropTypes.bool.isRequired,
    tip: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};
