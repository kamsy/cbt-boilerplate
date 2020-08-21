import React from "react";
import { Modal } from "antd";

const SelectISPModal = ({
    open_select_biller_modal,
    set_open_select_biller_modal,
    billers,
    handleSelectedBiller
}) => {
    return (
        <Modal
            getContainer={() => document.querySelector(".shared-modal-comp")}
            title="Select a biller"
            visible={open_select_biller_modal}
            footer={null}
            className="select-isp-modal"
            onCancel={() => {
                set_open_select_biller_modal(false);
            }}>
            <h3 className="section-header">Internet Service Providers (ISP)</h3>
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
        </Modal>
    );
};

export default SelectISPModal;
