import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "antd";
import PropTypes from "prop-types";

const CustomInput = ({
    control,
    errors,
    name,
    label,
    placeholder,
    register,
    defaultValue = "",
    type,
    disabled = false
}) => {
    const InputComponent = type === "password" ? Input.Password : Input;

    return (
        <div className="input-unit">
            <Controller
                as={
                    <label>
                        {label}
                        <InputComponent
                            {...{
                                placeholder,
                                ref: register,
                                defaultValue,
                                disabled
                            }}
                            className={`form-input ${
                                errors[name]?.message !== undefined
                                    ? "show-error"
                                    : "hide-error"
                            }`}
                        />
                    </label>
                }
                {...{ name, control }}
            />
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
    placeholder: PropTypes.string.isRequired,
    errors: PropTypes.object,
    control: PropTypes.object,
    ref: PropTypes.func
};

export default CustomInput;
