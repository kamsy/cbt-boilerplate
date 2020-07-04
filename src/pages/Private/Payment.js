import React from "react";
import { motion } from "framer";
import { pageVariants } from "../../components/ProtectedLayout";
import { Tabs, Button } from "antd";
import "../../scss/payment.scss";

const { TabPane } = Tabs;
function callback(key) {
    console.log(key);
}

const Payments = () => {
    const _addPane = ({ tab }) => {};
    const _renderEmptyState = tab => (
        <div className="empty-state">
            <span>You have not added {tab}</span>{" "}
            <Button className="custom-btn" onClick={() => _addPane({ tab })}>
                Add {tab}
            </Button>
        </div>
    );
    return (
        <motion.div
            className="main payment"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}>
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

export default Payments;
