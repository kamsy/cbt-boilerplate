import React, { forwardRef } from "react";
import { Controller } from "react-hook-form";
import { Select } from "antd";
import PropTypes from "prop-types";

const CustomSelect = forwardRef(
    (
        { control, errors, name, label, placeholder, defaultValue = "", type },
        ref
    ) => {
        return (
            <div className="input-unit custom-select">
                <Controller
                    as={
                        <label>
                            {label}
                            <Select
                                {...{ placeholder, ref }}
                                className={`form-select ${
                                    errors[name]?.message
                                        ? "show-error"
                                        : "hide-error"
                                }`}
                            />
                        </label>
                    }
                    {...{ name, control, defaultValue }}
                />
                <p
                    className={`form-error-text ${
                        errors[name]?.message ? "show" : "hide"
                    }`}>
                    {errors[name]?.message}
                </p>
            </div>
        );
    }
);

CustomSelect.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    errors: PropTypes.object,
    control: PropTypes.object,
    ref: PropTypes.func
};

export default CustomSelect;
