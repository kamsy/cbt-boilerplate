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
    console.log("options", options);
    return (
        <div className="input-unit custom-select">
            <Controller
                as={
                    <label>
                        {label}
                        <Select
                            getPopupContainer={() =>
                                document.querySelector(".layout")
                            }
                            {...{ placeholder, ref: register, defaultValue }}
                            className={`form-select ${
                                errors[name]?.message
                                    ? "show-error"
                                    : "hide-error"
                            }`}
                            onChange={val => console.log(val)}>
                            {options?.map(({ code, name, slug }) => {
                                return (
                                    <Option key={code} value={code}>
                                        <span className="bank-logo">
                                            {/* <img
                                                alt={`${name}'s logo`}
                                                src={`https://nigerianbanks.xyz/logo/${slug}.png`}
                                            /> */}
                                        </span>
                                        {name}
                                    </Option>
                                );
                            })}
                        </Select>
                    </label>
                }
                {...{ name, control }}
            />
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
