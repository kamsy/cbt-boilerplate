import React, { useEffect } from "react";
import { Button } from "antd";
import CustomInput from "./CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import UserServices from "../services/userServices";
import MomentAdapter from "@date-io/moment";

const moment = new MomentAdapter();

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
    const {
        handleSubmit,
        control,
        errors,
        register,
        reset,
        getValues,
        setValue
    } = methods;

    const _callValueSetter = data => {
        if (!data) return;
        const {
            monthly_income,
            annual_income,
            sector,
            position,
            duration,
            company_name,
            address,
            start_date
        } = data;
        setValue("monthly_income", monthly_income / 100);
        setValue("annual_income", annual_income / 100);
        setValue("sector", sector);
        setValue("position", position);
        setValue("duration", duration);
        setValue("company_name", company_name);
        setValue("address", address);
        setValue("start_date", moment.moment(start_date));
    };

    const onSubmit = async payload => {
        window._toggleLoader();
        const start_date = moment
            .moment(new Date(payload.start_date))
            .format("YYYY-MM-DD");
        const monthly_income =
            payload.monthly_income
                .split(",")
                .join("")
                .split("₦")
                .join("") * 100;
        const annual_income =
            payload.annual_income
                .split(",")
                .join("")
                .split("₦")
                .join("") * 100;
        const res = await UserServices.addEmploymentService({
            ...payload,
            start_date,
            monthly_income,
            annual_income
        });
        setTimeout(() => {
            window._toggleLoader();
        }, 500);
        const { status, data } = res;
        if (status === 201) {
            _callValueSetter(data.employment);
        }
    };

    const getEmployment = async () => {
        window._toggleLoader();
        const res = await UserServices.getEmploymentService();
        setTimeout(() => {
            window._toggleLoader();
        }, 500);
        const { status, data } = res;
        if (status === 200 && data.employment) {
            _callValueSetter(data.employment);
        }
    };

    useEffect(() => {
        const { monthly_income } = getValues();
        if (monthly_income) {
            setTimeout(() => {
                _callValueSetter(getValues());
            }, 10);
        }
        tab_key === 4 && !monthly_income && getEmployment();
    }, [tab_key]);

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
                        label: "Company Name",
                        name: "company_name",
                        register,
                        placeholder: "Enter your company",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "Company Address",
                        name: "address",
                        register,
                        placeholder: "Enter your company's address",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "Role at Company",
                        name: "position",
                        register,
                        placeholder: "Enter your role at your company",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "Sector",
                        name: "sector",
                        register,
                        placeholder: "Enter sector",
                        errors,
                        control
                    }}
                />
                <CustomInput
                    {...{
                        label: "Start Date",
                        name: "start_date",
                        register,
                        placeholder: "Select resumption date at company",
                        errors,
                        control,
                        type: "date"
                    }}
                />
                <CustomInput
                    {...{
                        label: "Duration at Company (months)",
                        name: "duration",
                        register,
                        placeholder: "Enter time at company",
                        errors,
                        control
                    }}
                />
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
                        label: "Annual Income",
                        name: "annual_income",
                        register,
                        placeholder: "Enter your annual income",
                        errors,
                        control,
                        type: "money"
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
