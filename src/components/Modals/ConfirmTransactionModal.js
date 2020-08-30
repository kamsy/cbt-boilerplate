import React from "react";
import { Modal } from "antd";
import CustomButton from "../CustomButton";

const ConfirmTransactionModal = ({
    open_trans_confirm_modal,
    question,
    _cancelAction,
    _confirmAction
}) => {
    return (
        <Modal
            getContainer={() => document.querySelector(".shared-modal-comp")}
            destroyOnClose
            className="confirm-delete-modal"
            title="Confirm Transaction"
            visible={open_trans_confirm_modal}
            footer={null}
            onCancel={_cancelAction}>
            <span className="action-explanation">{question}</span>
            <div className="btns-cont">
                <CustomButton
                    {...{
                        text: "No, Cancel",
                        extraClass: "red-bg delete",
                        onClick: _cancelAction
                    }}
                />
                <CustomButton
                    {...{
                        text: "Yes, proceed",
                        onClick: _confirmAction
                    }}
                />
            </div>
        </Modal>
    );
};

export default ConfirmTransactionModal;
