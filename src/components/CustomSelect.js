import React from "react";
import { Controller } from "react-hook-form";
import { Select } from "antd";
import PropTypes from "prop-types";
const { Option } = Select;

const CustomSelect = ({
    control,
    errors,
    name,
    label,
    options,
    register,
    placeholder,
    defaultValue = ""
}) => {
    return (
        <div className="input-unit custom-select">
            <label>
                {label}
                <Controller
                    as={
                        <Select
                            getPopupContainer={() =>
                                document.querySelector(".layout")
                            }
                            {...{ placeholder, ref: register, defaultValue }}
                            className={`form-select ${
                                errors[name]?.message
                                    ? "show-error"
                                    : "hide-error"
                            }`}>
                            {options?.map(({ name, value, key }) => {
                                return (
                                    <Option {...{ key, value }}>{name}</Option>
                                );
                            })}
                        </Select>
                    }
                    {...{ name, control }}
                />
            </label>
            <p
                className={`form-error-text ${
                    errors[name]?.message ? "show" : "hide"
                }`}>
                {errors[name]?.message}
            </p>
        </div>
    );
};

CustomSelect.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    errors: PropTypes.object,
    control: PropTypes.object
};

export default CustomSelect;
