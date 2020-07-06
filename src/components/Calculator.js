import React, { useState } from "react";
import "../scss/landing.scss";
import { Input, Select } from "antd";
import NumberFormat from "react-number-format";
import { _formatMoney } from "../services/utils";
const { Option } = Select;

export default () => {
    const [input_val, set_input_val] = useState("");
    const _onChange = ({ value }) => set_input_val(value);
    const _handleDuration = val => {
        console.log(val);
    };
    return (
        <div className="calculator">
            <div className="calculator-sub">
                <label>
                    loan amount
                    <NumberFormat
                        customInput={Input}
                        isNumericString
                        value={input_val}
                        thousandSeparator
                        prefix="₦"
                        onValueChange={_onChange}
                        allowNegative={false}
                        placeholder="Enter Amount"
                    />
                    <p
                        className={`form-error-text ${
                            Number(input_val) > 100000 ? "show" : "hide"
                        }`}>
                        {Number(input_val) > 100000 &&
                            "Maximum loan amount is ₦100,000"}
                    </p>
                </label>
                <label>
                    duration
                    <Select
                        onChange={_handleDuration}
                        placeholder="Select Period">
                        <Option value="30">30 days</Option>
                        <Option value="60">60 days</Option>
                        <Option value="90">90 days</Option>
                    </Select>
                </label>

                <div className="breakdown">
                    <div className="left">
                        <p>
                            you'll payback <br />
                            {_formatMoney(
                                Number(input_val) * 0.05 + Number(input_val) ||
                                    0
                            )}
                        </p>
                    </div>
                    <div className="right">
                        <p>
                            quickcredit fee <br />
                            5%
                        </p>
                    </div>
                </div>
                <div className="assurance">
                    <div className="top">
                        <p>Free automatic settlement between 24 hours</p>
                        <p>No hidden fees or charges</p>
                    </div>
                    <div className="bottom">
                        <p>Zero integration fee</p>
                        <p>Zero maintenance fee</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
