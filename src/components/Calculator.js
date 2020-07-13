import React, { useState } from "react";
import "../scss/landing.scss";
import { Input, Select } from "antd";
import NumberFormat from "react-number-format";
import { _formatMoney } from "../services/utils";
const { Option } = Select;

export default () => {
    const [amount, set_amount] = useState("");
    const [repay_amount, set_repay_amount] = useState("");
    const [duration, set_duration] = useState(0);
    const _handleAmount = ({ value }) => {
        const amt = Number(value);
        set_amount(amt);
        if (duration < 30) return;
        calculateRepayment({ amt, time: duration });
    };

    const calculateRepayment = ({ amt, time }) => {
        const floor_percent = 0.05;
        const after_floor_percent = 0.25;
        const floor_charge_duration = 1;
        const after_floor_charge_duration = 29;

        const floor = amt * floor_percent;
        const after_floor =
            amt *
            (((time - floor_charge_duration) * after_floor_percent) /
                after_floor_charge_duration);

        const total = amt + floor + after_floor;
        set_repay_amount(total);
    };

    const _handleDuration = val => {
        const time = Number(val);
        set_duration(time);
        if (amount < 1) return;
        calculateRepayment({ amt: amount, time });
    };

    return (
        <div className="calculator">
            <div className="calculator-sub">
                <label>
                    loan amount
                    <NumberFormat
                        customInput={Input}
                        isNumericString
                        value={amount}
                        thousandSeparator
                        prefix="₦"
                        onValueChange={_handleAmount}
                        allowNegative={false}
                        placeholder="Enter Amount"
                    />
                    <p
                        className={`form-error-text ${
                            Number(amount) > 100000 ? "show" : "hide"
                        }`}>
                        {Number(amount) > 100000 &&
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
                            {_formatMoney(repay_amount || 0)}
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
