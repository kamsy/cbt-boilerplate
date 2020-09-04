import React, { useState } from "react";
import "../scss/landing.scss";
import { Input } from "antd";
import NumberFormat from "react-number-format";
import { _formatMoney } from "../services/utils";
import MomentAdapter from "@date-io/moment";

const moment = new MomentAdapter();

const Calculator = () => {
    const [amount, set_amount] = useState("");
    const [repay_amount, set_repay_amount] = useState("");
    const [duration, set_duration] = useState(0);
    const [repayment_brkdwn, set_repayment_brkdwn] = useState([]);
    const [errors, set_errors] = useState({
        amount: false,
        duration: false,
        bank_statement: false,
        identification_document: false
    });

    const _handleAmount = ({ value }) => {
        const amt = Number(value);
        set_amount(amt);
        if (duration < 30) return;
        calculateRepayment({ amt, time: duration });
    };
    const calculateRepayment = ({ amt, time }) => {
        if (time < 1 && amt < 10000) return;
        const floor_percent = 0.05;
        const after_floor_percent = 0.25;
        const floor_charge_duration = 1;
        const after_floor_charge_duration = 29;

        const floor =
            time <= 30
                ? amt * floor_percent
                : amt * floor_percent * Math.ceil(time / 30);
        const after_floor =
            time <= 30
                ? amt *
                  (((time - floor_charge_duration) * after_floor_percent) /
                      after_floor_charge_duration)
                : Math.ceil(time / 30) *
                  amt *
                  (((30 - floor_charge_duration) * after_floor_percent) /
                      after_floor_charge_duration);
        const total = Math.floor(amt + floor + after_floor);
        set_repay_amount(total);
        const repayment_brkdwn_arr = [];
        if (time <= 30) {
            repayment_brkdwn_arr.push({
                month: moment
                    .moment(new Date())
                    .add(time, "days")
                    .format("MMM DD, yyyy"),
                amount: total
            });
        } else if (time > 30 && time <= 60) {
            repayment_brkdwn_arr.push({
                month: moment
                    .moment(new Date())
                    .add(30, "days")
                    .format("MMM DD, yyyy"),
                amount: total / 2
            });
            repayment_brkdwn_arr.push({
                month: moment
                    .moment(new Date())
                    .add(time, "days")
                    .format("MMM DD, yyyy"),
                amount: total / 2
            });
        } else if (time > 60) {
            repayment_brkdwn_arr.push({
                month: moment
                    .moment(new Date())
                    .add(30, "days")
                    .format("MMM DD, yyyy"),
                amount: total / 3
            });
            repayment_brkdwn_arr.push({
                month: moment
                    .moment(new Date())
                    .add(60, "days")
                    .format("MMM DD, yyyy"),
                amount: total / 3
            });
            repayment_brkdwn_arr.push({
                month: moment
                    .moment(new Date())
                    .add(time, "days")
                    .format("MMM DD, yyyy"),
                amount: total / 3
            });
        }
        set_repayment_brkdwn(repayment_brkdwn_arr);
    };

    const _handleDuration = ({ target: { value } }) => {
        const time = Number(value);
        set_duration(time);
        set_errors({ ...errors, duration: false });
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
                        maxLength={6}
                        onValueChange={_handleAmount}
                        allowNegative={false}
                        placeholder="Enter Amount"
                    />
                    <p
                        className={`form-error-text ${
                            Number(amount) > 100000 ? "show" : "hide"
                        }`}>
                        Maximum loan amount is ₦100,000
                    </p>
                </label>
                <label>
                    duration
                    <Input
                        value={duration}
                        onChange={_handleDuration}
                        placeholder="Enter Duration"
                    />
                    <p
                        className={`form-error-text ${
                            Number(duration) > 90 ? "show" : "hide"
                        }`}>
                        Loan tenure cannot exceed 90 days
                    </p>
                </label>

                <div className="breakdown">
                    <div className="left">
                        <p>
                            you'll payback <br />
                            {_formatMoney(repay_amount || 0)}
                        </p>
                    </div>
                    <div
                        className={`repayment-brkdwn ${
                            repay_amount > 0 ? "show" : ""
                        }`}>
                        <p className="p-hdr">Repayment Plan:</p>
                        {repayment_brkdwn.map(({ amount, month }) => (
                            <p className="brk-dwn-item">
                                <span className="month">{month}:</span>
                                <span className="amt">
                                    {_formatMoney(Math.floor(amount))}
                                </span>
                            </p>
                        ))}
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

export default Calculator;
