import React, { useState } from "react";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import "../../scss/dashboard.scss";
import EmptyTable from "../../components/EmptyTable";
import {
    _formatMoney,
    _limitText,
    _currencyToInteger
} from "../../services/utils";
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
import VisaCard from "../../assets/svgs/VisaCard";
import MasterCard from "../../assets/svgs/MasterCard";
import MicroChip from "../../assets/svgs/MicroChip";
import { decryptAndRead } from "../../services/localStorageHelper";
import { ENCRYPT_USER } from "../../variables";
import useCards from "../../hooks/useCards";
import TransferModal from "../../components/Modals/TransferModal";
import useBillers from "../../hooks/useBillers";
import useBanks from "../../hooks/useBanks";
import useTransactions from "../../hooks/useTransactions";
import useWallet from "../../hooks/useWallet";

import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "@popmotion/popcorn";
import useDeleteCard from "../../hooks/useDeleteCard";
import ConfirmActionModal from "../../components/Modals/ConfirmActionModal";
import { ArrowLeftSvg } from "../../assets/svgs/ArrowLeftSvg";

const moment = new MomentAdapter();

const variants = {
    enter: direction => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: direction => {
        return {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        };
    }
};

const Dashboard = () => {
    const { user_info } = decryptAndRead(ENCRYPT_USER);

    // custom hooks
    const [{ transactions, getTransactions }] = useTransactions();
    const [{ billers }] = useBillers();
    const [{ cards, set_cards }] = useCards();
    const [{ banks_with_logos }] = useBanks();
    const [{ wallet }] = useWallet();
    const [
        {
            deleteCard,
            toggleConfirmActionModal,
            item_to_delete_info,
            open_confirm_modal,
            set_open_confirm_modal,
            set_item_to_delete_info
        }
    ] = useDeleteCard({ set_cards });

    // modals
    const [open_fund_wallet_modal, set_open_fund_wallet_modal] = useState(
        false
    );
    const [open_airtime_modal, set_open_airtime_modal] = useState(false);
    const [open_biller_modal, set_open_biller_modal] = useState(false);
    const [open_select_biller_modal, set_open_select_biller_modal] = useState(
        false
    );
    const [open_transfer_modal, set_open_transfer_modal] = useState(false);

    //
    const [biller_info, set_biller_info] = useState([]);

    const handleSelectedBiller = info => {
        set_biller_info(info);
        set_open_select_biller_modal(false);
        set_open_biller_modal(true);
    };

    const buyAirtime = async () => {
        const payload = transaction_payload;
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        const { response, status, data } = await BillServices.buyAirtimeService(
            {
                phone: `+234${payload.phone.substring(1)}`,
                amount: _currencyToInteger(payload.amount)
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
            _currencyToInteger(payload.amount)


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

    const [
        open_trans_confirm_modal_obj,
        set_open_trans_confirm_modal
    ] = useState({
        open_trans_confirm_modal: false
    });

    const [transaction_payload, set_transaction_payload] = useState({});

    const cancelTransaction = () => {
        set_transaction_payload({});
        set_open_trans_confirm_modal({
            open_trans_confirm_modal: false,
            type: null
        });
    };

    const confirmTransaction = () => {
        switch (transaction_payload.type) {
            case "airtime":
                buyAirtime();
                break;
            case "data":
                buyDataBundle();
                break;
            case "fund-wallet":
                fundWallet();
                break;
            default:
                return;
        }
        set_open_trans_confirm_modal({
            open_trans_confirm_modal: false,
            type: null
        });
    };

    const confirmBuyAirtime = payload => {
        set_transaction_payload({ type: "airtime", ...payload });
        set_open_airtime_modal(false);
        set_open_trans_confirm_modal({
            open_trans_confirm_modal: true,
            type: "verify"
        });
    };

    const toggleSpecificCardModal = type => {
        switch (type) {
            case "data":
                set_open_select_biller_modal(true);
                break;
            case "wallet":
                set_open_fund_wallet_modal(true);
                break;
            case "airtime":
                set_open_airtime_modal(true);
                break;
            case "transfer":
                set_open_transfer_modal(true);
                break;
            default:
                return;
        }
    };

    const handleCardClick = type => {
        if (!user_info.pin) {
            return set_open_trans_confirm_modal({
                open_trans_confirm_modal: true,
                type: "add",
                closeModalFunc: () => set_open_trans_confirm_modal(false),
                openOriginalModalFunc: () => toggleSpecificCardModal(type)
            });
        }
        toggleSpecificCardModal(type);
    };

    const [[page, direction], setPage] = useState([0, 0]);

    // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
    // then wrap that within 0-2 to find our image ID in the array below. By passing an
    // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
    // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
    const cardIndex = wrap(0, cards.length, page);

    const paginate = newDirection => {
        setPage([page + newDirection, newDirection]);
    };

    const active_card = cards[cardIndex];

    const ATMCardWrapper = cards.length > 1 ? motion.a : motion.div;

    return (
        <motion.div
            className="main dashboard shared-modal-comp"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <ConfirmActionModal
                {...{
                    open_confirm_modal,
                    set_open_confirm_modal,
                    item_to_delete_info,
                    set_item_to_delete_info
                }}
            />
            <ConfirmTransactionModal
                {...{
                    ...open_trans_confirm_modal_obj,
                    _confirmAction: confirmTransaction,
                    _cancelAction: cancelTransaction
                }}
            />
            <TransferModal
                {...{
                    banks: banks_with_logos,
                    open_transfer_modal,
                    set_open_transfer_modal,
                    set_open_trans_confirm_modal,
                    set_transaction_payload
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
                    set_transaction_payload
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

            <h1 className="page-title">Dashboard</h1>
            <p>Welcome back, {user_info.name}</p>
            <div className="top-section">
                <div
                    className="card"
                    role="button"
                    onClick={() => handleCardClick("airtime")}>
                    <span className="svg-cont">
                        <AirtimeSvg />
                    </span>
                    <span className="text">Buy Airtime</span>
                </div>
                <div
                    className="card"
                    role="button"
                    onClick={() => handleCardClick("data")}>
                    <span className="svg-cont">
                        <InternetSvg />
                    </span>
                    <span className="text">Buy Data Bundle</span>
                </div>
                <div
                    className="card"
                    role="button"
                    onClick={() => handleCardClick("wallet")}>
                    <span className="svg-cont">
                        <WalletSvg />
                    </span>
                    <span className="text">Fund Wallet</span>
                </div>
                <div
                    className="card"
                    role="button"
                    onClick={() => handleCardClick("transfer")}>
                    <span className="svg-cont">
                        <TransferSvg />
                    </span>
                    <span className="text">Transfer</span>
                </div>
            </div>
            <div className="middle-section">
                <div className="wallet-cont">
                    <h4 className="title-txt">My Wallet</h4>
                    <div className="wallet-info">
                        <div className="card">
                            <span className="balance">Balance</span>
                            <p>{_formatMoney(wallet.amount / 100)}</p>
                        </div>
                    </div>
                </div>
                <div className="cards-cont">
                    <h4 className="title-txt">My Cards ({cards.length})</h4>

                    <div className="cards">
                        <AnimatePresence>
                            <ATMCardWrapper
                                key={page}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 200
                                    },
                                    opacity: { duration: 0.2 }
                                }}
                                href="#"
                                className="card-cont">
                                <div className="card">
                                    <div className="card-front">
                                        <div className="top">
                                            <span className="card-bank">
                                                {active_card?.bank}
                                            </span>
                                            <span className="brand-logo">
                                                {active_card?.brand ===
                                                "visa" ? (
                                                    <VisaCard />
                                                ) : active_card?.brand ===
                                                  "mastercard" ? (
                                                    <MasterCard />
                                                ) : null}
                                            </span>
                                        </div>
                                        <div className="mid">
                                            <span className="chip">
                                                <MicroChip />
                                            </span>
                                            <span className="last-four">
                                                **** **** ****{" "}
                                                {active_card?.last_four}
                                            </span>
                                        </div>
                                        <div className="btm">
                                            <p className="card-hlder">
                                                {_limitText(
                                                    active_card?.user.name ||
                                                        "",
                                                    25
                                                )}
                                            </p>
                                            <span className="expiry">
                                                {active_card?.month}/
                                                {active_card?.year}
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="card-back"
                                        role="button"
                                        onClick={() =>
                                            toggleConfirmActionModal({
                                                id: active_card?.id,
                                                type: "card",
                                                card_number: `**** **** ****${active_card?.last_four}`,
                                                modalHeaderTitle:
                                                    "Confirm deleting this card",
                                                confirmAction: deleteCard
                                            })
                                        }>
                                        <span className="delete-btn">
                                            Delete Card
                                        </span>
                                    </div>
                                </div>
                            </ATMCardWrapper>
                        </AnimatePresence>
                    </div>

                    <div
                        className={`cards-control ${
                            cards.length > 1 ? "show" : "hide"
                        }`}>
                        <div className="prev" onClick={() => paginate(-1)}>
                            <ArrowLeftSvg />
                        </div>
                        <div className="next" onClick={() => paginate(1)}>
                            <ArrowLeftSvg />
                        </div>
                    </div>
                </div>
                <div className="analytics-cont">
                    <h4 className="title-txt">Analytics</h4>
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
            </div>
            <div className="table-container">
                <h3 className="last-five">Last 5 transactions</h3>
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
