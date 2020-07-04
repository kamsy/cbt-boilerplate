import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";

export const Loader = ({
    tip = "Please wait...",
    className,
    loading,
    children
}) => (
    <Spin spinning={loading} tip={tip} className={className}>
        {children}
    </Spin>
);

Loader.propTypes = {
    loading: PropTypes.bool.isRequired,
    tip: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};
