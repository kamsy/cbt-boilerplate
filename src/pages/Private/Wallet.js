import React from "react";
import { motion } from "framer";
import { pageVariants } from "../../components/ProtectedLayout";
import { Tabs, Button } from "antd";
import "../../scss/wallet.scss";

const { TabPane } = Tabs;
function callback(key) {
    console.log(key);
}

const Wallet = () => {
    const _addPane = ({ tab }) => {};
    const _renderEmptyState = tab => (
        <div className="empty-state">
            <span>
                You have not added a{tab},<br /> Click the button below to add a{" "}
                {tab}.
            </span>
            <Button className="custom-btn" onClick={() => _addPane({ tab })}>
                Add {tab}
            </Button>
        </div>
    );
    return (
        <motion.div
            className="main wallet"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}>
            <div className="wallet-info-container"></div>
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="Bank" key="1">
                    {_renderEmptyState("bank")}
                </TabPane>
                <TabPane tab="Card" key="2">
                    {_renderEmptyState("card")}
                </TabPane>
            </Tabs>
        </motion.div>
    );
};

export default Wallet;
