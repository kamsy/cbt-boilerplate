import React, { useState, useEffect } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { _formatMoney } from "../../services/utils";
import "../../scss/create-loan.scss";
import { Input, Upload, message, Radio } from "antd";
import NumberFormat from "react-number-format";
import CustomButton from "../../components/CustomButton";
import LoanServices from "../../services/loanServices";
import { NotifySuccess } from "../../components/Notification";
import { useHistory } from "react-router-dom";
import { url } from "../../App";
import MomentAdapter from "@date-io/moment";
import { decryptAndRead } from "../../services/localStorageHelper";
import { ENCRYPT_USER } from "../../variables";
const RadioBtn = Radio.Button;

const moment = new MomentAdapter();

function beforeUpload(file) {
    const isPDF = file.type === "application/pdf";
    if (!isPDF) {
        message.error("You can only upload PDF file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("PDF must smaller than 2MB!");
    }
    return false;
}

const CreateLoan = () => {
    const { user_info } = decryptAndRead(ENCRYPT_USER);

    useEffect(() => {
        set_use_previous(user_info.taken_loan);
    }, []);
    const history = useHistory();
    const [errors, set_errors] = useState({
        amount: false,
        duration: false,
        bank_statement: false,
        identification_document: false
    });
    const [amount, set_amount] = useState("");
    const [repay_amount, set_repay_amount] = useState("");
    const [duration, set_duration] = useState("");
    const [bank_statement, set_bank_statement] = useState(null);
    const [repayment_brkdwn, set_repayment_brkdwn] = useState([]);
    const [identification_document, set_identification_document] = useState(
        null
    );

    const onSubmit = async () => {
        const valid = use_previous
            ? amount > 10000 && amount <= 100000 && duration > 0
            : amount > 10000 &&
              amount <= 100000 &&
              duration > 0 &&
              bank_statement &&
              identification_document;
        if (valid) {
            window._toggleLoader();
            var formData = new FormData();
            formData.append("amount", amount * 100);
            formData.append("duration", duration);
            formData.append("repay_amount", repay_amount * 100);
            if (!use_previous) {
                formData.append("bank_statement", bank_statement);
                formData.append(
                    "identification_document",
                    identification_document
                );
            } else {
                formData.append("use_previous", 1);
            }
            const res = await LoanServices.applyForLoanService(formData);
            setTimeout(() => {
                window._toggleLoader();
            }, 500);
            const { status } = res;
            if (status === 201) {
                NotifySuccess("Loan requested successfully");
                setTimeout(() => {
                    history.push(`${url}loans`);
                }, 700);
            }
        } else {
            set_errors({
                ...errors,
                amount: amount < 10000,
                duration: duration < 1,
                bank_statement: use_previous ? false : !bank_statement,
                identification_document: use_previous
                    ? false
                    : !identification_document
            });
        }
    };
    const _handleAmount = ({ value }) => {
        const amt = Number(value);
        if (amt > 0) set_errors({ ...errors, amount: false });
        set_amount(amt);
        if (duration < 1) return;
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
        if (time > 90) return;
        set_duration(time);
        set_errors({ ...errors, duration: false });
        if (amount < 1) return;
        calculateRepayment({ amt: amount, time });
    };

    const uploadButton = (
        <div className="ant-upload-text">
            Click to upload <strong>OR</strong> Drag 'n' drop to upload
        </div>
    );

    const _handleDocumentUpload = ({ file }) => {
        set_identification_document(file);
    };

    const _handleBankStatement = ({ file }) => {
        set_bank_statement(file);
    };

    const [use_previous, set_use_previous] = useState(false);

    const handleRadioBtnChange = ({ target: { value } }) => {
        value === "use_previous"
            ? set_use_previous(true)
            : set_use_previous(false);
    };

    return (
        <motion.div
            className="main create-loan"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <h1 className="page-title">Request Loan</h1>
            <p>Please fill the form below appropriately to request a loan.</p>
            <div className="container">
                <div className="loan-form-container">
                    <h2 className="cont-hdr">Loan Request</h2>
                    <div className="radio-btns">
                        <Radio.Group
                            defaultValue={
                                user_info.taken_loan
                                    ? "use_previous"
                                    : "new_loan"
                            }
                            buttonStyle="solid"
                            onChange={handleRadioBtnChange}>
                            <RadioBtn
                                value="use_previous"
                                className="radio_btn">
                                <span className="txt">
                                    Use previous documents
                                </span>
                            </RadioBtn>
                            <RadioBtn value="new_loan" className="radio_btn">
                                <span className="txt">
                                    Upload new documents
                                </span>
                            </RadioBtn>
                        </Radio.Group>
                    </div>
                    <form className="form">
                        <label>
                            loan amount
                            <NumberFormat
                                className={`${
                                    errors.amount ? "show-error" : "hide-error"
                                }`}
                                customInput={Input}
                                isNumericString
                                value={amount}
                                thousandSeparator
                                maxLength={8}
                                prefix="₦"
                                onValueChange={_handleAmount}
                                allowNegative={false}
                                placeholder="Enter Amount"
                            />
                            <p
                                className={`form-error-text ${
                                    Number(amount) > 100000 || errors.amount
                                        ? "show"
                                        : "hide"
                                }`}>
                                {Number(amount) < 10000
                                    ? "Minimum loan amount is ₦10,000"
                                    : Number(amount) > 100000
                                    ? "Maximum loan amount is ₦100,000"
                                    : errors.amount
                                    ? "Input an amount"
                                    : ""}
                            </p>
                        </label>
                        <label>
                            duration
                            <Input
                                className={`${
                                    errors.duration
                                        ? "show-error"
                                        : "hide-error"
                                }`}
                                value={duration}
                                onChange={_handleDuration}
                                placeholder="1 - 90 days"
                            />
                            <p
                                className={`form-error-text ${
                                    Number(duration) > 90 || errors.duration
                                        ? "show"
                                        : "hide"
                                }`}>
                                {Number(duration) > 90
                                    ? "Loan tenure cannot exceed 90 days"
                                    : "Input duration"}
                            </p>
                        </label>

                        <div className="uploader">
                            <label className="uploader-label">
                                <span>
                                    bank statement{" "}
                                    <small>(last 2 months)</small>
                                </span>
                            </label>
                            <Upload
                                disabled={use_previous}
                                onRemove={() =>
                                    setTimeout(() => {
                                        set_bank_statement(null);
                                    }, 100)
                                }
                                accept=".pdf"
                                listType="picture-card"
                                beforeUpload={beforeUpload}
                                onChange={_handleBankStatement}
                                className={`${
                                    errors.bank_statement
                                        ? "show-error"
                                        : "hide-error"
                                }`}>
                                {!bank_statement && (
                                    <>
                                        {uploadButton}
                                        <p
                                            className={`form-error-text ${
                                                errors.bank_statement
                                                    ? "show"
                                                    : "hide"
                                            }`}>
                                            {errors.bank_statement &&
                                                "Upload your bank statement!"}
                                        </p>
                                    </>
                                )}
                            </Upload>
                        </div>
                        <div className="uploader">
                            <label className="uploader-label">
                                <span>identification document</span>
                            </label>
                            <Upload
                                disabled={use_previous}
                                accept=".pdf"
                                onRemove={() =>
                                    setTimeout(() => {
                                        set_identification_document(null);
                                    }, 100)
                                }
                                listType="picture-card"
                                beforeUpload={beforeUpload}
                                onChange={_handleDocumentUpload}
                                className={`${
                                    errors.identification_document
                                        ? "show-error"
                                        : "hide-error"
                                }`}>
                                {!identification_document && (
                                    <>
                                        {uploadButton}

                                        <p
                                            className={`form-error-text ${
                                                errors.identification_document
                                                    ? "show"
                                                    : "hide"
                                            }`}>
                                            {errors.identification_document &&
                                                "Upload your identification document!"}
                                        </p>
                                    </>
                                )}
                            </Upload>
                        </div>
                    </form>

                    <CustomButton text="Request Loan" onClick={onSubmit} />
                </div>
                <div className="loan-breakdown-container">
                    <h2 className="cont-hdr">Loan Details</h2>

                    <div className="bdy">
                        <div className="brk-dwn">
                            <div className="item">
                                <span>Total Loan Amount</span>
                                <span className="bld_txt">
                                    {_formatMoney(amount || 0)}
                                </span>
                            </div>
                            <div className="item">
                                <span>Loan Duration</span>
                                <span className="bld_txt">
                                    {Number(duration)} days
                                </span>
                            </div>
                            <div className="item">
                                <span>Repayment Amount</span>
                                <span className="bld_txt">
                                    {_formatMoney(repay_amount || 0)}
                                </span>
                            </div>
                            <div className="item">
                                <span>Repayment Date(s)</span>
                                <div>
                                    {repayment_brkdwn.length > 0
                                        ? repayment_brkdwn.map(
                                              ({ amount, month }, index) => (
                                                  <p
                                                      className="brk-dwn-item"
                                                      key={index}>
                                                      <span className="bld_txt">
                                                          {month}:
                                                      </span>
                                                      <span className="bld_txt">
                                                          {_formatMoney(
                                                              Math.floor(amount)
                                                          )}
                                                      </span>
                                                  </p>
                                              )
                                          )
                                        : "-"}
                                </div>
                            </div>
                        </div>

                        <div
                            className={`penalty-note ${
                                duration > 0 ? "show" : "hide"
                            }`}>
                            <h3>Estimated payback within {duration} days</h3>
                            <p>
                                The estimated date of payback of the full amount
                                is within loan duration that was provided. The
                                full amount is due within {duration} days. A{" "}
                                <span className="red">
                                    <strong>penalty charge of 2%</strong>
                                </span>{" "}
                                applies on each default days.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CreateLoan;
