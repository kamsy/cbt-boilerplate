import React, { useState } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import "../../scss/bills.scss";
import BillServices from "../../services/billsServices";
import BillerModal from "../../components/Modals/BillerModal";
import CustomInput from "../../components/CustomInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomButton from "../../components/CustomButton";
import { NotifyError, NotifySuccess } from "../../components/Notification";
import { message as AntMsg } from "antd";
import ConfirmTransactionModal from "../../components/Modals/ConfirmTransactionModal";
import { decryptAndRead } from "../../services/localStorageHelper";
import { ENCRYPT_USER } from "../../variables";
import useBillers from "../../hooks/useBillers";

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
    const { user_info } = decryptAndRead(ENCRYPT_USER);
    const [billers] = useBillers();
    const [open_biller_modal, set_open_biller_modal] = useState(false);
    const [biller_info, set_biller_info] = useState([]);

    const proceedToBuyData = selected_biller => {
        set_biller_info(selected_biller);
        set_open_biller_modal(true);
    };

    const handleSelectedBiller = selected_biller => {
        if (!user_info.pin) {
            return set_open_trans_confirm_modal({
                open_trans_confirm_modal: true,
                type: "add",
                closeModalFunc: () => closeTransConfirmModal(),
                openOriginalModalFunc: () => proceedToBuyData(selected_biller)
            });
        }
        proceedToBuyData(selected_biller);
    };

    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register, setValue } = methods;

    const buyAirtime = async () => {
        const payload = transaction_payload;
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        const { response, status, data } = await BillServices.buyAirtimeService(
            {
                phone: `+234${payload.phone.substring(1)}`,
                amount:
                    payload.amount
                        .split("₦")[1]
                        .split(",")
                        .join("") * 100
            }
        );

        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        if (status === 200) {
            setValue("phone", "");
            setValue("amount", "");
            NotifySuccess(data.message);
        }
        if (status === 500) {
            NotifyError(data.message);
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

    const buyDataBundle = async () => {
        const payload = transaction_payload;
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        const { response, status, data } = await BillServices.buyDataService({
            ...payload,
            phone: `+234${payload.phone.substring(1)}`,
            amount: payload.amount * 100
        });

        setTimeout(() => {
            window._toggleLoader();
        }, 500);
        if (status === 200) {
            NotifySuccess(data.message);
        }
        if (response) {
            const {
                status,
                data: { message: msg }
            } = response;
            if (status === 503) {
                NotifyError(msg);
            } else if (status === 406) {
                AntMsg.error(msg);
                set_open_biller_modal(false);
                setTimeout(() => {
                    // set_open_fund_wallet_modal(true);
                }, 500);
            }
        }
    };

    const [
        open_trans_confirm_modal_obj,
        set_open_trans_confirm_modal
    ] = useState({
        open_trans_confirm_modal: false
    });

    const [transaction_payload, set_transaction_payload] = useState({});

    const cancelTransaction = () => {
        set_transaction_payload({});
        set_open_trans_confirm_modal(false);
    };

    const confirmTransaction = () => {
        switch (transaction_payload.type) {
            case "airtime":
                buyAirtime();
                break;
            case "data":
                buyDataBundle();
                break;
            default:
                return;
        }
        set_open_trans_confirm_modal(false);
    };

    const proceedToBuyAirtime = payload => {
        set_transaction_payload({ type: "airtime", ...payload });
        set_open_trans_confirm_modal({
            open_trans_confirm_modal: true,
            type: "verify"
        });
    };

    const closeTransConfirmModal = () =>
        set_open_trans_confirm_modal({
            open_trans_confirm_modal: false,
            type: null
        });

    const confirmBuyAirtime = payload => {
        if (!user_info.pin) {
            return set_open_trans_confirm_modal({
                open_trans_confirm_modal: true,
                type: "add",
                closeModalFunc: () => closeTransConfirmModal(),
                openOriginalModalFunc: () => proceedToBuyAirtime(payload)
            });
        }
        proceedToBuyAirtime(payload);
    };

    return (
        <motion.div
            className="main shared-modal-comp"
            id="bills-history"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <ConfirmTransactionModal
                {...{
                    ...open_trans_confirm_modal_obj,
                    _confirmAction: confirmTransaction,
                    _cancelAction: cancelTransaction
                }}
            />
            <BillerModal
                {...{
                    open_biller_modal,
                    ...biller_info,
                    set_open_biller_modal,
                    set_transaction_payload,
                    set_open_trans_confirm_modal
                }}
            />
            <h1 className="page-title">Bills</h1>
            <div className="bills">
                <div className="left-cont">
                    <h3 className="section-header">Airtime</h3>
                    <span className="desc">
                        Enter a phone number and an amount to recharge
                    </span>
                    <div className="airtime-container">
                        <form
                            className="form-buy-airtime form"
                            name="buy-airtimer-form"
                            onSubmit={handleSubmit(confirmBuyAirtime)}>
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
                                    onClick: handleSubmit(confirmBuyAirtime)
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
            </div>{" "}
        </motion.div>
    );
};

export default Bills;
