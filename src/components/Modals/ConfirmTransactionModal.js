import React, { useState } from "react";
import { Modal, message } from "antd";
import CustomButton from "../CustomButton";
import PinInput from "react-pin-input";
import PinServices from "../../services/pinServices";
import {
    encryptAndStore,
    decryptAndRead
} from "../../services/localStorageHelper";
import { ENCRYPT_USER } from "../../variables";

const ConfirmTransactionModal = ({
    open_trans_confirm_modal,
    _cancelAction,
    type,
    closeModalFunc,
    openOriginalModalFunc,

    _confirmAction
}) => {
    const { user_info, token, expires_in } = decryptAndRead(ENCRYPT_USER);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pin, setPin] = useState("");

    const verifyPin = async () => {
        setLoading(true);
        const res = await PinServices[
            type === "add" ? "createPinService" : "verifyPinService"
        ]({ pin });
        setLoading(false);
        const { status, data, response } = res;
        if (status === 200 && type !== "add") {
            _confirmAction();
        }
        if (status === 201 && type === "add") {
            user_info.pin = true;
            encryptAndStore(ENCRYPT_USER, { token, expires_in, user_info });
            message.success(data.message);
            closeModalFunc();
            openOriginalModalFunc();
        } else if (
            response &&
            response.status >= 400 &&
            response.status < 500
        ) {
            setError(response.data.message);
        }
    };
    return (
        <Modal
            getContainer={() => document.querySelector(".shared-modal-comp")}
            destroyOnClose
            className="enter-pin-modal"
            title={`${type === "add" ? "Create PIN" : "Confirm Transaction"}`}
            visible={open_trans_confirm_modal}
            footer={null}
            onCancel={_cancelAction}>
            <div className="input-unit">
                <span className="pin">
                    {type === "add"
                        ? `Hi ${
                              user_info.name.split(" ")[0]
                          }, you don't have a transaction PIN yet. Enter your PIN below to set it up.`
                        : "Enter  your pin"}
                </span>
                <PinInput
                    length={4}
                    initialValue=""
                    secret
                    onChange={pin => {
                        setPin(pin);
                        error && setError(null);
                    }}
                    type="numeric"
                    inputMode="number"
                    onComplete={(value, index) => {}}
                />
                <p className={`form-error-text ${error ? "show" : "hide"}`}>
                    {error}
                </p>
            </div>

            <CustomButton
                {...{
                    loading,
                    disabled: pin.length !== 4,
                    text: `${type === "add" ? "Create" : "Verify"} PIN`,
                    onClick: verifyPin
                }}
            />
        </Modal>
    );
};

export default ConfirmTransactionModal;
