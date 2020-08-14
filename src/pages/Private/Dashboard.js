import React, { useState, useEffect } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import "../../scss/dashboard.scss";
import TransactionsServices from "../../services/transactionsServices";
import EmptyTable from "../../components/EmptyTable";
import { _formatMoney } from "../../services/utils";
import MomentAdapter from "@date-io/moment";
import AirtimeSvg from "../../assets/svgs/AirtimeSvg";
import InternetSvg from "../../assets/svgs/InternetSvg";
import WalletSvg from "../../assets/svgs/WalletSvg";
import TransferSvg from "../../assets/svgs/TransferSvg";
import Chart from "react-google-charts";
import FundWalletModal from "../../components/Modals/FundWalletModal";
import BuyAirtimeModal from "../../components/Modals/BuyAirtimeModal";
import BillerModal from "../../components/Modals/BillerModal";
const moment = new MomentAdapter();

const Dashboard = () => {
    const [transactions, set_transactions] = useState([]);

    const getTransactions = ({ page }) => {
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        TransactionsServices.getTransactionsService({ page }).then(
            ({ status, data }) => {
                setTimeout(() => {
                    window._toggleLoader();
                }, 500);
                if (status === 200) {
                    set_transactions(data.transactions || []);
                }
            }
        );
    };

    useEffect(() => {
        getTransactions({ page: 1 });
    }, []);

    const [open_fund_wallet_modal, set_open_fund_wallet_modal] = useState(
        false
    );

    const [open_airtime_modal, set_open_airtime_modal] = useState(false);

    const [open_biller_modal, set_open_biller_modal] = useState(false);
    return (
        <motion.div
            className="main dashboard shared-modal-comp"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <FundWalletModal
                {...{ open_fund_wallet_modal, set_open_fund_wallet_modal }}
            />
            <BuyAirtimeModal
                {...{
                    open_airtime_modal,
                    set_open_airtime_modal,
                    set_open_fund_wallet_modal
                }}
            />

            <BillerModal
                {...{
                    open_biller_modal,
                    set_open_biller_modal,
                    set_open_fund_wallet_modal
                }}
            />
            <div className="top-section">
                <div className="left-cont">
                    <div
                        className="card"
                        role="button"
                        onClick={() => set_open_airtime_modal(true)}>
                        <span className="svg-cont">
                            <AirtimeSvg />
                        </span>
                        <span className="text">Buy Airtime</span>
                    </div>
                    <div className="card" role="button">
                        <span className="svg-cont">
                            <InternetSvg />
                        </span>
                        <span className="text">Buy Data Bundle</span>
                    </div>
                    <div
                        className="card"
                        role="button"
                        onClick={() => set_open_fund_wallet_modal(true)}>
                        <span className="svg-cont">
                            <WalletSvg />
                        </span>
                        <span className="text">Fund Wallet</span>
                    </div>
                    <div className="card" role="button">
                        <span className="svg-cont">
                            <TransferSvg />
                        </span>
                        <span className="text">Wallet to Wallet transfer</span>
                    </div>
                </div>
                <div className="middle-cont">
                    <Chart
                        width={"500px"}
                        height={"300px"}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ["Status", "Amount"],
                            ["Failed", 11],
                            ["Successful", 2],
                            ["Pending", 2]
                        ]}
                        options={{
                            title: "Transactions"
                        }}
                        rootProps={{ "data-testid": "1" }}
                    />
                </div>
                <div className="right-cont"></div>
            </div>
            <h3 className="last-five">Last 5 transactions</h3>
            <div className="table-container">
                <table className="table">
                    <thead className="table-header">
                        <tr>
                            <th>Transaction ID</th>
                            <th>amount</th>
                            <th>type</th>
                            <th>description</th>
                            <th>date</th>
                            <th>time</th>
                        </tr>
                    </thead>
                    <tbody className="tableBody">
                        {transactions.data?.length < 1 ? (
                            <EmptyTable text="No transactions" />
                        ) : (
                            transactions.data?.map(
                                ({
                                    amount,
                                    id,
                                    created_at,
                                    description,
                                    type,
                                    status
                                }) => (
                                    <tr key={id}>
                                        <td>{id}</td>
                                        <td>{_formatMoney(amount / 100)}</td>
                                        <td>{type}</td>
                                        <td className={status}>
                                            {description}
                                        </td>
                                        <td>
                                            {moment
                                                .moment(new Date(created_at))
                                                .format("MMM DD, yyyy")}
                                        </td>
                                        <td>
                                            {moment
                                                .moment(new Date(created_at))
                                                .format("h:mm:ss a")}
                                        </td>
                                    </tr>
                                )
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default Dashboard;
