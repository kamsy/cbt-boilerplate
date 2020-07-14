import React, { useEffect } from "react";
import { Button } from "antd";
import CustomInput from "./CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

const schema = yup.object().shape({
    monthly_income: yup.string().required("Enter your monthly income!"),
    annual_income: yup.string().required("Enter your annual income!"),
    sector: yup.string().required("Enter your sector!"),
    position: yup.string().required("Enter your position!"),
    duration: yup.string().required("Enter duration you've worked at company!"),
    company_name: yup.string().required("Enter your company name!"),
    address: yup.string().required("Enter your company address!"),
    start_date: yup.string().required("Select date your resumed at company!")
});

const EmploymentInfo = ({ tab_key }) => {
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register, reset } = methods;

    const onSubmit = data => {};

    useEffect(() => {
        reset();
    }, [tab_key, reset]);
    return (
        <form
            className="form-change-password form"
            name="change-password-form"
            onSubmit={handleSubmit(onSubmit)}>
            <span className="pane-sub-header">Next of Kin information.</span>
            <div className="form-inputs-container">
                <CustomInput
                    {...{
                        label: "Monthly Income",
                        name: "monthly_income",
                        register,
                        placeholder: "Enter your monthly income",
                        errors,
                        control,
                        type: "money"
                    }}
                />
                <CustomInput
                    {...{
                        label: "Last Name",
                        name: "last_name",
                        register,
                        placeholder: "Enter your kin's last name",
                        errors,
                        control
                    }}
                />
            </div>

            <Button className="custom-btn" onClick={handleSubmit(onSubmit)}>
                Submit
            </Button>
        </form>
    );
};

export default EmploymentInfo;
