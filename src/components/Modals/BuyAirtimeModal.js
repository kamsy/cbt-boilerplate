import React, { useState } from "react";
import { Modal, message as AntMsg } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { NotifySuccess, NotifyError } from "../Notification";
import BillServices from "../../services/billsServices";

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

const BuyAirtimeModal = ({
    open_airtime_modal,
    set_open_airtime_modal,
    set_open_fund_wallet_modal
}) => {
    const [loading, set_loading] = useState(false);
    const methods = useForm({
        resolver: yupResolver(schema)
    });
    const { handleSubmit, control, errors, register, reset } = methods;

    const onSubmit = async payload => {
        set_loading(true);
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
        set_loading(false);
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
                set_open_airtime_modal(false);
                setTimeout(() => {
                    set_open_fund_wallet_modal(false);
                }, 500);
            }
        }
    };

    const closeModal = () => {
        reset();
        return set_open_airtime_modal(false);
    };

    return (
        <Modal
            getContainer={() => document.querySelector(".shared-modal-comp")}
            destroyOnClose
            title="Buy Airtime"
            visible={open_airtime_modal}
            footer={null}
            onCancel={closeModal}>
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
        </Modal>
    );
};

export default BuyAirtimeModal;
