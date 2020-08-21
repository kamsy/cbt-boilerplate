import React, { useState } from "react";
import { Modal, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import BankServices from "../../services/bankServices";
const { Option } = Select;

const ConfirmActionModal = ({
    set_open_confirm_modal,
    open_confirm_modal,

    item_to_delete_info,
    set_item_to_delete_info
}) => {
    const closeModal = () => {
        set_open_confirm_modal(false);
        set_item_to_delete_info({});
    };

    const _confirmAction = () => {
        closeModal();
        item_to_delete_info.confirmAction();
    };

    return (
        <Modal
            getContainer={() => document.querySelector(".shared-modal-comp")}
            destroyOnClose
            className="confirm-delete-modal"
            title={item_to_delete_info.modalHeaderTitle}
            visible={open_confirm_modal}
            footer={null}
            onCancel={closeModal}>
            <span className="action-explanation">
                You are about to delete{" "}
                {item_to_delete_info.type === "bank"
                    ? item_to_delete_info.bank_name
                    : item_to_delete_info.card_number}{" "}
                {item_to_delete_info["card_number" || "bank_name"]}. Are you
                sure about this?
            </span>
            <div className="btns-cont">
                <CustomButton
                    {...{
                        text: "Cancel",
                        onClick: closeModal
                    }}
                />
                <CustomButton
                    {...{
                        text: "Yes, delete",
                        extraClass: "red-bg delete",
                        onClick: _confirmAction
                    }}
                />
            </div>
        </Modal>
    );
};

export default ConfirmActionModal;
