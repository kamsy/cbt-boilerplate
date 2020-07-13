import React, { useState } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { _formatMoney } from "../../services/utils";
import "../../scss/create-loan.scss";
import { Input, Select, Upload, message } from "antd";
import NumberFormat from "react-number-format";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import CustomButton from "../../components/CustomButton";
import LoanServices from "../../services/loanServices";

const { Option } = Select;

function beforeUpload(file) {
    const isPDF = file.type === "application/pdf";
    if (!isPDF) {
        message.error("You can only upload PDF file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("PDF must smaller than 2MB!");
    }
    // return isPDF && isLt2M;
    return false;
}

const CreateLoan = () => {
    const [errors, set_errors] = useState({
        amount: false,
        duration: false,
        bank_statement: false,
        identification_document: false
    });
    console.log("CreateLoan -> errors", errors);
    const [loading, set_loading] = useState(false);
    const [amount, set_amount] = useState("");
    const [repay_amount, set_repay_amount] = useState("");
    const [duration, set_duration] = useState(0);
    const [bank_statement, set_bank_statement] = useState(null);
    console.log(
        "CreateLoan -> bank_statement",
        bank_statement,
        bank_statement && bank_statement[0]
    );
    const [identification_document, set_identification_document] = useState(
        null
    );

    const onSubmit = async () => {
        if (
            amount > 0 &&
            duration >= 30 &&
            bank_statement &&
            identification_document
        ) {
            window._toggleLoader();
            var formData = new FormData();
            formData.append("amount", amount);
            formData.append("duration", duration);
            formData.append("repay_amount", repay_amount);
            formData.append("bank_statement", bank_statement);
            formData.append("identification_document", identification_document);
            const res = await LoanServices.applyForLoanService(formData);
            console.log("onSubmit -> res", { res });
            setTimeout(() => {
                window._toggleLoader();
            }, 500);
            const { status, data } = res;
        } else {
            set_errors({
                ...errors,
                amount: amount < 1,
                duration: duration < 30,
                bank_statement: !bank_statement,
                identification_document: !identification_document
            });
        }
    };
    const _handleAmount = ({ value }) => {
        const amt = Number(value);
        if (amt > 0) set_errors({ ...errors, amount: false });
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
        set_errors({ ...errors, duration: false });
        if (amount < 1) return;
        calculateRepayment({ amt: amount, time });
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">
                Click to upload <br /> or
                <br /> Drag 'n' drop to upload
            </div>
        </div>
    );

    const _handleDocumentUpload = ({ file }) => {
        set_identification_document(file);
        // set_errors({ ...errors, identification_document: false });
    };

    const _handleBankStatement = ({ file }) => {
        set_bank_statement(file);
        // set_errors({ ...errors, bank_statement: false });
    };

    return (
        <motion.div
            className="main create-loan"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <div className="">
                <p>
                    Please fill the form below appropriately to request a loan.
                </p>
                <div className="loan-form-container">
                    <form>
                        <div className="left-col">
                            <label>
                                loan amount
                                <NumberFormat
                                    className={`${
                                        errors.amount
                                            ? "show-error"
                                            : "hide-error"
                                    }`}
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
                                        Number(amount) > 100000 || errors.amount
                                            ? "show"
                                            : "hide"
                                    }`}>
                                    {Number(amount) > 100000
                                        ? "Maximum loan amount is ₦100,000"
                                        : "Input an amount"}
                                </p>
                            </label>
                            <label>
                                duration
                                <Select
                                    className={`${
                                        errors.duration
                                            ? "show-error"
                                            : "hide-error"
                                    }`}
                                    onChange={_handleDuration}
                                    placeholder="Select Period">
                                    <Option value="30">30 days</Option>
                                    <Option value="60">60 days</Option>
                                    <Option value="90">90 days</Option>
                                </Select>
                                <p
                                    className={`form-error-text ${
                                        errors.duration ? "show" : "hide"
                                    }`}>
                                    {errors.duration && "Select a duration!"}
                                </p>
                            </label>
                            <p className="repayment">
                                <span>Amount to Repay</span>
                                <span>{_formatMoney(repay_amount || 0)}</span>
                            </p>
                            <p className="penalty-note">
                                <strong>
                                    NB: A{" "}
                                    <span className="red">
                                        penalty charge of 2%{" "}
                                    </span>
                                    applies on each default days.
                                </strong>
                            </p>
                        </div>
                        <div className="right-col">
                            <div className="uploader">
                                <label>
                                    <span>
                                        bank statement{" "}
                                        <small>(last 2 months)</small>
                                    </span>
                                </label>
                                <Upload
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
                                <label>
                                    <span>identification document</span>
                                </label>
                                <Upload
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
                        </div>
                    </form>
                    <div className="submit-btn-cont">
                        <CustomButton
                            text="Submit Application"
                            onClick={onSubmit}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CreateLoan;
