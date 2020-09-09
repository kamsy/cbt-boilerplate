import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import CustomButton from "../CustomButton";
import PinInput from "react-pin-input";
import PinServices from "../../services/pinServices";

const UpdatePinModal = ({ open_update_pin_modal, closeModal }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [current_pin, set_current_pin] = useState("");
    const [new_pin, set_new_pin] = useState("");

    const updatePIN = async () => {
        setLoading(true);
        const res = await PinServices.updatePinService({
            current_pin,
            new_pin
        });
        setLoading(false);
        const { status, data, response } = res;

        if (status === 200) {
            message.success(data.message);
            closeModal();
        } else if (
            response &&
            response.status >= 400 &&
            response.status < 500
        ) {
            setError(response.data.message);
        }
    };

    useEffect(() => {
        if (current_pin.length === 4 && new_pin.length === 4) {
            if (current_pin === new_pin) {
                setError("New pin cannot be the same as the old one!");
            } else {
                setError(null);
            }
        }
    }, [current_pin, new_pin]);
    return (
        <Modal
            getContainer={() => document.querySelector(".shared-modal-comp")}
            destroyOnClose
            className="update-pin-modal"
            title="Update PIN"
            visible={open_update_pin_modal}
            footer={null}
            onCancel={closeModal}>
            <div className="input-unit">
                <span className="pin">Enter your old and new PIN.</span>

                <span className="current_pin">Current PIN</span>
                <PinInput
                    length={4}
                    initialValue=""
                    secret
                    onChange={pin => {
                        set_current_pin(pin);
                        error && setError(null);
                    }}
                    type="numeric"
                    inputMode="number"
                    onComplete={(value, index) => {}}
                />
                <span className="new_pin">New PIN</span>
                <PinInput
                    length={4}
                    initialValue=""
                    secret
                    onChange={pin => {
                        set_new_pin(pin);
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
                    disabled:
                        current_pin.length !== 4 ||
                        new_pin.length !== 4 ||
                        current_pin === new_pin,
                    text: "Update PIN",
                    onClick: updatePIN
                }}
            />
        </Modal>
    );
};

export default UpdatePinModal;
