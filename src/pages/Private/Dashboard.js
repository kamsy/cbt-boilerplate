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
import BillServices from "../../services/billsServices";
import SelectISPModal from "../../components/Modals/SelectISPModal";
import { message as AntMsg } from "antd";
import ConfirmTransactionModal from "../../components/Modals/ConfirmTransactionModal";
import { NotifySuccess, NotifyError } from "../../components/Notification";
import WalletServices from "../../services/walletServices";
import CardServices from "../../services/cardServices";

const moment = new MomentAdapter();

const Dashboard = () => {
    const [transactions, set_transactions] = useState([]);
    const [billers, set_billers] = useState([]);

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
    const getBillers = ({ page }) => {
        BillServices.getBillersService({ page }).then(({ status, data }) => {
            if (status === 200) {
                set_billers(data || []);
            }
        });
    };

    useEffect(() => {
        getTransactions({ page: 1 });
        getBillers({ page: 1 });
        getCards();
    }, []);

    const [open_fund_wallet_modal, set_open_fund_wallet_modal] = useState(
        false
    );

    const [open_airtime_modal, set_open_airtime_modal] = useState(false);

    const [open_biller_modal, set_open_biller_modal] = useState(false);
    const [open_select_biller_modal, set_open_select_biller_modal] = useState(
        false
    );
    const [biller_info, set_biller_info] = useState([]);
    const [cards, set_cards] = useState([]);
    console.log("cards", cards);
    const handleSelectedBiller = info => {
        set_biller_info(info);
        set_open_select_biller_modal(false);
        set_open_biller_modal(true);
    };

    const getCards = async () => {
        const res = await CardServices.getCardsService();
        const { status, data } = res;
        if (status === 200) {
            set_cards(data?.cards || []);
        }
    };

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
                    set_open_fund_wallet_modal(true);
                }, 500);
            }
        }
    };

    const fundWallet = async () => {
        const payload = transaction_payload;
        const amount =
            payload.amount
                .split(",")
                .join("")
                .split("₦")
                .join("") * 100;

        window._toggleLoader();
        const res = await WalletServices.fundWalletService({
            ...payload,
            amount
        });
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        const { status, data } = res;
        if (status === 200) {
            NotifySuccess(data.message);
            getTransactions({ page: 1 });
        }
    };

    const [open_trans_confirm_modal, set_open_trans_confirm_modal] = useState(
        false
    );

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
            case "wallet":
                fundWallet();
                break;
            default:
                return;
        }
        set_open_trans_confirm_modal(false);
    };

    const confirmBuyAirtime = payload => {
        set_transaction_payload({ type: "airtime", ...payload });
        set_open_airtime_modal(false);
        set_open_trans_confirm_modal(true);
    };

    return (
        <motion.div
            className="main dashboard shared-modal-comp"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <ConfirmTransactionModal
                {...{
                    question:
                        transaction_payload.type === "wallet"
                            ? `Are you sure you want to fund your wallet with ${transaction_payload.amount}?`
                            : transaction_payload.type === "airtime"
                            ? `Are you sure you want to buy airtime of ${transaction_payload.amount}?`
                            : `Are you sure you want to purchase ${transaction_payload.bundle}?`,
                    open_trans_confirm_modal,
                    _confirmAction: confirmTransaction,
                    _cancelAction: cancelTransaction
                }}
            />
            <SelectISPModal
                {...{
                    open_select_biller_modal,
                    set_open_select_biller_modal,
                    handleSelectedBiller,
                    billers
                }}
            />
            <FundWalletModal
                {...{
                    open_fund_wallet_modal,
                    cards,
                    set_open_fund_wallet_modal,
                    set_open_trans_confirm_modal,
                    set_fund_payload: set_transaction_payload
                }}
            />
            <BuyAirtimeModal
                {...{
                    confirmBuyAirtime,
                    open_airtime_modal,
                    set_open_airtime_modal,
                    set_open_fund_wallet_modal
                }}
            />

            <BillerModal
                {...{
                    open_biller_modal,
                    set_open_biller_modal,
                    set_open_fund_wallet_modal,
                    ...biller_info,
                    set_transaction_payload,
                    set_open_trans_confirm_modal
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
                    <div
                        className="card"
                        role="button"
                        onClick={() => set_open_select_biller_modal(true)}>
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
