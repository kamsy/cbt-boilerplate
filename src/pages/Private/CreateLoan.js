import React, { useState } from "react";
import { motion } from "framer";
import { pageVariants } from "../../components/ProtectedLayout";
import { _formatMoney } from "../../services/utils";
import "../../scss/create-loan.scss";
import { Input, Select, Upload, message } from "antd";
import NumberFormat from "react-number-format";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import CustomButton from "../../components/CustomButton";

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
    return isPDF && isLt2M;
}

const CreateLoan = () => {
    const [loading, set_loading] = useState(false);
    const [input_val, set_input_val] = useState("");

    const onSubmit = data => {};
    const _handleAmount = ({ value }) => set_input_val(value);

    const _handleDuration = val => {
        console.log(val);
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

    const _handleDocumentUpload = doc => {
        console.log(doc);
    };

    const _handleBankStatement = doc => {
        console.log(doc);
    };
    return (
        <motion.div
            className="main create-loan"
            initial="initial"
            animate="in"
            exit="out"
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
                                    customInput={Input}
                                    isNumericString
                                    value={input_val}
                                    thousandSeparator
                                    prefix="₦"
                                    onValueChange={_handleAmount}
                                    allowNegative={false}
                                    placeholder="Enter Amount"
                                />
                                <p
                                    className={`form-error-text ${
                                        Number(input_val) > 100000
                                            ? "show"
                                            : "hide"
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
                                    name="bank_statement"
                                    listType="picture-card"
                                    beforeUpload={beforeUpload}
                                    onChange={_handleBankStatement}>
                                    {/* {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="avatar"
                                    style={{ width: "100%" }}
                                />
                            ) : (
                                uploadButton
                            )} */}
                                    {uploadButton}
                                </Upload>
                            </div>
                            <div className="uploader">
                                <label>
                                    <span>identification document</span>
                                </label>
                                <Upload
                                    name="identification_document"
                                    listType="picture-card"
                                    beforeUpload={beforeUpload}
                                    onChange={_handleDocumentUpload}>
                                    {/* {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="avatar"
                                    style={{ width: "100%" }}
                                />
                            ) : (
                                uploadButton
                            )} */}
                                    {uploadButton}
                                </Upload>
                            </div>
                        </div>
                    </form>
                    <div className="submit-btn-cont">
                        <CustomButton
                            text="Submit Application"
                            onClick={onSubmit}
                        />
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
                </div>
            </div>
        </motion.div>
    );
};

export default CreateLoan;
