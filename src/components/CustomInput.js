import React from "react";
import { Controller } from "react-hook-form";
import { Input, DatePicker } from "antd";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";

const CustomInput = ({
    control,
    errors,
    name,
    label,
    placeholder,
    register,
    defaultValue = "",
    type,
    disabled = false,
    prefix,
    inputProps
}) => {
    const InputComponent =
        type === "password"
            ? Input.Password
            : type === "money" || type === "token"
            ? NumberFormat
            : type === "date"
            ? DatePicker
            : Input;

    return (
        <div className="input-unit">
            <label>
                {label}
                <Controller
                    as={
                        <InputComponent
                            {...{
                                placeholder,
                                ref: register,
                                defaultValue,
                                disabled,
                                type,
                                name,
                                prefix,
                                ...inputProps
                            }}
                            className={`form-input ${
                                type === "date" ||
                                type === "money" ||
                                type === "token"
                                    ? "ant-input"
                                    : ""
                            } ${
                                errors[name]?.message !== undefined
                                    ? "show-error"
                                    : "hide-error"
                            }`}
                        />
                    }
                    {...(type === "money"
                        ? {
                              prefix: "₦",
                              thousandSeparator: true
                          }
                        : null)}
                    {...(type === "token"
                        ? {
                              prefix: "",
                              thousandSeparator: false
                          }
                        : null)}
                    {...{
                        name,
                        control
                    }}
                />
            </label>
            <p
                className={`form-error-text ${
                    errors[name]?.message !== undefined ? "show" : "hide"
                }`}>
                {errors[name]?.message}
            </p>
        </div>
    );
};

CustomInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    prefix: PropTypes.string,
    placeholder: PropTypes.string.isRequired,
    errors: PropTypes.object,
    control: PropTypes.object,
    ref: PropTypes.func
};

export default CustomInput;
