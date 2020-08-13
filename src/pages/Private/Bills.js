import React, { useState, useEffect } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import "../../scss/bills.scss";
import BillServices from "../../services/billsServices";
import BillerModal from "../../components/Modals/BillerModal";
import CustomInput from "../../components/CustomInput";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomButton from "../../components/CustomButton";
import { NotifyError, NotifySuccess } from "../../components/Notification";

const schema = yup.object().shape({
    phone: yup
        .string()
        .required("Enter a phone number!")
        .matches(
            /^([0]?\d([7](?=0)|[8](?=0|1)|[9](?=0))\d{9}(?!\d))$/,
            "Alaye focus!... na 9ja number be this?😐"
        ),
    amount: yup.string().required("Enter an amount!")
});

const Bills = () => {
    const [billers, set_billers] = useState([]);
    const [open_biller_modal, set_open_biller_modal] = useState(false);
    const [loading, set_loading] = useState(false);
    const [biller_info, set_biller_info] = useState([]);

    const getBillers = ({ page }) => {
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        BillServices.getBillersService({ page }).then(({ status, data }) => {
            setTimeout(() => {
                window._toggleLoader();
            }, 500);
            if (status === 200) {
                set_billers(data || []);
            }
        });
    };

    const handleSelectedBiller = info => {
        set_biller_info(info);
        set_open_biller_modal(true);
    };

    useEffect(() => {
        getBillers({ page: 1 });
    }, []);

    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register } = methods;

    const onSubmit = async payload => {
        console.log(
            "payload",
            payload.amount
                .split("₦")[1]
                .split(",")
                .join("")
        );
        set_loading(true);
        const {
            response,
            status,
            data: { message }
        } = await BillServices.buyAirtimeService({
            phone: `+234${payload.phone.substring(1)}`,
            amount:
                payload.amount
                    .split("₦")[1]
                    .split(",")
                    .join("") * 100
        });
        set_loading(false);
        if (status === 200) {
            NotifySuccess(message);
        }
        if (response) {
            const {
                status,
                data: { message: msg }
            } = response;
            if (status === 503) {
                NotifyError(msg);
            } else if (status === 406) {
                NotifyError(msg);
            }
        }
    };

    return (
        <motion.div
            className="main bills"
            id="bills-history"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <div className="left-cont">
                <h3 className="section-header">Airtime</h3>
                <span className="desc">
                    Enter a phone number and an amount to recharge
                </span>
                <div className="airtime-container">
                    <form
                        className="form-buy-airtime form"
                        name="buy-airtimer-form"
                        onSubmit={handleSubmit(onSubmit)}>
                        <CustomInput
                            {...{
                                label: "Enter Phone Number",
                                name: "phone",
                                register,
                                placeholder: "Enter phone number",
                                errors,
                                control
                            }}
                        />
                        <CustomInput
                            {...{
                                label: "Enter Amount",
                                name: "amount",
                                register,
                                placeholder: "Enter amount to recharge",
                                errors,
                                control,
                                type: "money"
                            }}
                        />
                        <CustomButton
                            {...{
                                text: "Buy Airtime",
                                extraClass: "full-size",
                                onClick: handleSubmit(onSubmit),
                                loading
                            }}
                        />
                    </form>
                </div>
            </div>

            <div className="right-cont">
                <h3 className="section-header">
                    Internet Service Providers (ISP)
                </h3>
                <span className="desc">
                    Select your ISP to purchase a data bundle
                </span>
                <div className="billers-container">
                    {billers.map(({ name, logo, plans }) => {
                        return (
                            <div
                                key={name}
                                className="biller"
                                role="button"
                                onClick={() =>
                                    handleSelectedBiller({
                                        plans,
                                        logo,
                                        biller_name: name
                                    })
                                }>
                                <img
                                    src={logo}
                                    alt={`${name} logo`}
                                    className="biller-img"
                                />
                                <span className="biller-name">{name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <BillerModal
                {...{
                    open_biller_modal,
                    ...biller_info,
                    set_open_biller_modal
                }}
            />
        </motion.div>
    );
};

export default Bills;
