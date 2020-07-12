import React from "react";
import { notification } from "antd";
import PropTypes from "prop-types";
const key = "updatable";
const NotifySuccess = (description, duration = 5) =>
    notification.success({
        key,
        message: "SUCCESS!",
        description,
        duration,
        getContainer: () => document.querySelector(".layout"),
        className: "success"
        // icon: <SuccessToastSvg />
    });

NotifySuccess.propTypes = {
    description: PropTypes.string.isRequired,
    duration: PropTypes.number
};

const NotifyError = (description, duration = 5) =>
    notification.error({
        key,
        message: "ERROR!",
        description,
        duration,
        getContainer: () => document.querySelector(".layout"),
        className: "error"
        // icon: <ErrorToastSvg />
    });

NotifyError.propTypes = {
    description: PropTypes.string.isRequired,
    duration: PropTypes.number
};

const NotifyClose = () => notification.destroy();

export { NotifyClose, NotifyError, NotifySuccess };
