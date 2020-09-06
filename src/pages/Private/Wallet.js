import React, { useState, useEffect } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { _formatMoney, _limitText } from "../../services/utils";
import { Button, Pagination, Tabs } from "antd";
import "../../scss/wallet.scss";
import { PaystackConsumer } from "react-paystack";
import { decryptAndRead } from "../../services/localStorageHelper";
import { ENCRYPT_USER } from "../../variables";
import BankServices from "../../services/bankServices";
import AddBankModal from "../../components/Modals/AddBankModal";
import { NotifySuccess } from "../../components/Notification";
import CardServices from "../../services/cardServices";
import VisaCard from "../../assets/svgs/VisaCard";
import MasterCard from "../../assets/svgs/MasterCard";
import MicroChip from "../../assets/svgs/MicroChip";
import WalletServices from "../../services/walletServices";
import FundWalletModal from "../../components/Modals/FundWalletModal";
import MomentAdapter from "@date-io/moment";
import EmptyTable from "../../components/EmptyTable";
import TableSelectFilters from "../../components/TableSelectFIlters";
import ConfirmActionModal from "../../components/Modals/ConfirmActionModal";
import ConfirmTransactionModal from "../../components/Modals/ConfirmTransactionModal";
import TransferModal from "../../components/Modals/TransferModal";
import useBanks from "../../hooks/useBanks";
import useCards from "../../hooks/useCards";
import TransferServices from "../../services/transferServices";
import useTransactions from "../../hooks/useTransactions";
import useWallet from "../../hooks/useWallet";
const moment = new MomentAdapter();

const { TabPane } = Tabs;

const Wallet = () => {
    const { user_info } = decryptAndRead(ENCRYPT_USER);

    // hooks

    const [{ banks, set_banks, getBanks, banks_with_logos }] = useBanks();
    const [{ cards, set_cards }] = useCards();
    const [{ wallet, getWallet }] = useWallet();
    const [
        { transactions, set_transactions, getTransactions }
    ] = useTransactions();

    // modals
    const [open_confirm_modal, set_open_confirm_modal] = useState(false);
    const [
        open_trans_confirm_modal_obj,
        set_open_trans_confirm_modal
    ] = useState({
        open_trans_confirm_modal: false
    });
    const [open_modal, set_open_modal] = useState(false);
    const [open_fund_wallet_modal, set_open_fund_wallet_modal] = useState(
        false
    );
    const [open_transfer_modal, set_open_transfer_modal] = useState(false);

    //
    const [transaction_payload, set_transaction_payload] = useState({});
    const [item_to_delete_info, set_item_to_delete_info] = useState({});

    //
    const componentProps = {
        reference: `q_c_ng_card_ref_${new Date().getTime()}`,
        email: user_info.email,
        amount: 5000,
        publicKey: "pk_test_36fc18e976546bd2549c78c2dc7e97d8ee014144",
        onSuccess: ({ reference }) => {
            window._toggleLoader();
            CardServices.verifyCardService(reference).then(
                ({ status, data }) => {
                    if (status === 201) {
                        const cards_arr = [...cards];
                        cards_arr.push(data.card);
                        set_cards(cards_arr);
                    }
                    setTimeout(() => {
                        window._toggleLoader();
                    }, 500);
                }
            );
        },
        onClose: e => console.log(e)
    };

    const deleteBank = async id => {
        window._toggleLoader();
        const res = await BankServices.deleteBankService(id);
        setTimeout(() => {
            window._toggleLoader();
        }, 500);
        const { status, data } = res;
        if (status === 200) {
            NotifySuccess(data.message);
            const banks_arr = [...banks];
            const index_of_bank = banks_arr.findIndex(bank => bank.id === id);
            banks_arr.splice(index_of_bank, 1);
            set_banks(banks_arr);
        }
    };

    const deleteCard = async id => {
        window._toggleLoader();
        const res = await CardServices.deleteCardService(id);
        setTimeout(() => {
            window._toggleLoader();
        }, 500);
        const { status, data } = res;
        if (status === 200) {
            NotifySuccess(data.message);
            const cards_arr = [...cards];
            const index_of_bank = cards_arr.findIndex(card => card.id === id);
            cards_arr.splice(index_of_bank, 1);
            set_cards(cards_arr);
        }
    };

    const onPaginationChange = page => getTransactions({ page });

    const toggleConfirmActionModal = data => {
        set_item_to_delete_info(data);
        set_open_confirm_modal(true);
    };

    const walletActionType = type => {
        switch (type) {
            case "fund-wallet":
                checkUserHasPin(set_open_fund_wallet_modal);
                break;
            case "transfer":
                checkUserHasPin(set_open_transfer_modal);
                break;
            default:
                return;
        }
    };

    const closeTransConfirmModal = () =>
        set_open_trans_confirm_modal({
            open_trans_confirm_modal: false,
            type: null
        });

    const checkUserHasPin = cb_func => {
        if (!user_info.pin) {
            return set_open_trans_confirm_modal({
                open_trans_confirm_modal: true,
                type: "add",
                closeModalFunc: () => closeTransConfirmModal(),
                openOriginalModalFunc: () => cb_func(true)
            });
        } else {
            cb_func(true);
        }
    };

    const fundWallet = async () => {
        const amount =
            transaction_payload.amount
                .split(",")
                .join("")
                .split("₦")
                .join("") * 100;

        window._toggleLoader();
        const res = await WalletServices.fundWalletService({
            ...transaction_payload,
            amount
        });
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        const { status, data } = res;
        if (status === 200) {
            NotifySuccess(data.message);
            getWallet && getWallet();
            getTransactions && getTransactions({ page: 1 });
            return set_open_trans_confirm_modal({
                open_trans_confirm_modal: false,
                type: null
            });
        }
    };

    const walletTransfer = async () => {
        const amount =
            transaction_payload.amount
                .split(",")
                .join("")
                .split("₦")
                .join("") * 100;

        window._toggleLoader();
        const res = await TransferServices.transferToWalletService({
            username: transaction_payload.username,
            amount
        });
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        const { status, data } = res;
        if (status === 200) {
            NotifySuccess(data.message);
            getWallet && getWallet();
            getTransactions && getTransactions({ page: 1 });
            return set_open_trans_confirm_modal({
                open_trans_confirm_modal: false,
                type: null
            });
        }
    };

    const bankTransfer = async () => {
        const amount =
            transaction_payload.amount
                .split(",")
                .join("")
                .split("₦")
                .join("") * 100;

        console.log("bankTransfer -> transaction_payload", transaction_payload);
        window._toggleLoader();
        const res = await TransferServices.transferToBankService({
            bank_code: transaction_payload.bank_code,
            account_number: transaction_payload.account_number,
            amount
        });
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        const { status, data } = res;
        console.log("bankTransfer -> res", { res });
        if (status === 200) {
            NotifySuccess(data.message);
            getWallet && getWallet();
            getTransactions && getTransactions({ page: 1 });
            return set_open_trans_confirm_modal({
                open_trans_confirm_modal: false,
                type: null
            });
        }
    };

    const confirmTransaction = () => {
        switch (transaction_payload.type) {
            case "fund-wallet":
                fundWallet();
                break;
            case "wallet-transfer":
                walletTransfer();
                break;
            case "bank-transfer":
                bankTransfer();
                break;
            default:
                return;
        }
        set_open_trans_confirm_modal({
            open_trans_confirm_modal: false,
            type: null
        });
    };

    const cancelTransaction = () => {
        set_transaction_payload({});
        set_open_trans_confirm_modal({
            open_trans_confirm_modal: false,
            type: null
        });
    };

    return (
        <motion.div
            className="main wallet shared-modal-comp"
            id="wallet-history"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <ConfirmTransactionModal
                {...{
                    ...open_trans_confirm_modal_obj,
                    _confirmAction: confirmTransaction,
                    _cancelAction: cancelTransaction
                }}
            />
            <ConfirmActionModal
                {...{
                    open_confirm_modal,
                    set_open_confirm_modal,
                    item_to_delete_info,
                    set_item_to_delete_info
                }}
            />
            <AddBankModal
                {...{
                    open_modal,
                    set_open_modal,
                    banks: banks_with_logos,
                    getBanks
                }}
            />
            <FundWalletModal
                {...{
                    cards,
                    open_fund_wallet_modal,
                    set_open_fund_wallet_modal,
                    set_open_trans_confirm_modal,
                    set_transaction_payload
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
            <h1 className="page-title">Wallet & Transactions</h1>
            <div className="top-section">
                <div className="bank-card-info-container">
                    <Tabs defaultActiveKey="0">
                        <TabPane tab="Wallet" key="0">
                            <div className="wallet-info">
                                <div className="card">
                                    <span className="balance">Balance</span>
                                    <p>{_formatMoney(wallet.amount / 100)}</p>
                                    <div className="btns-cont">
                                        <Button
                                            className="custom-btn"
                                            onClick={() =>
                                                walletActionType("fund-wallet")
                                            }>
                                            Fund Wallet
                                        </Button>
                                        <Button
                                            className="custom-btn"
                                            onClick={() =>
                                                walletActionType("transfer")
                                            }>
                                            Transfer
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabPane>

                        <TabPane tab="Bank" key="1">
                            <div className="add-card card-cont">
                                <Button
                                    className="custom-btn"
                                    onClick={() => set_open_modal(true)}>
                                    Add Bank
                                </Button>
                            </div>

                            {banks.map(({ bank_name, account_number, id }) => (
                                <a
                                    href="#"
                                    className="card-cont bank-card"
                                    key={id}>
                                    <div className="card">
                                        <div className="card-front">
                                            <span className="bank-name">
                                                {bank_name}
                                            </span>

                                            <span className="account-num">
                                                {account_number}
                                            </span>
                                        </div>
                                        <div
                                            className="card-back"
                                            role="button"
                                            onClick={() =>
                                                toggleConfirmActionModal({
                                                    id,
                                                    type: "bank",
                                                    bank_name: bank_name,
                                                    modalHeaderTitle:
                                                        "Confirm deleting this bank",
                                                    confirmAction: deleteBank
                                                })
                                            }>
                                            <span className="delete-btn">
                                                Delete {bank_name}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </TabPane>
                        <TabPane tab="Card" key="2">
                            <div className="add-card card-cont">
                                <PaystackConsumer {...componentProps}>
                                    {({ initializePayment }) => (
                                        <Button
                                            className="custom-btn"
                                            onClick={initializePayment}>
                                            Add Card
                                        </Button>
                                    )}
                                </PaystackConsumer>
                            </div>

                            {cards.map(
                                ({
                                    bank,
                                    brand,
                                    last_four,
                                    user,
                                    month,
                                    year,
                                    id
                                }) => (
                                    <a href="#" className="card-cont" key={id}>
                                        <div className="card">
                                            <div className="card-front">
                                                <div className="top">
                                                    <span className="card-bank">
                                                        {bank}
                                                    </span>
                                                    <span className="brand-logo">
                                                        {brand === "visa" ? (
                                                            <VisaCard />
                                                        ) : brand ===
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
                                                        {last_four}
                                                    </span>
                                                </div>
                                                <div className="btm">
                                                    <p className="card-hlder">
                                                        {_limitText(
                                                            user.name || "",
                                                            25
                                                        )}
                                                    </p>
                                                    <span className="expiry">
                                                        {month}/{year}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="card-back"
                                                role="button"
                                                onClick={() =>
                                                    toggleConfirmActionModal({
                                                        id,
                                                        type: "card",
                                                        card_number: `**** **** ****${last_four}`,
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
                                    </a>
                                )
                            )}
                        </TabPane>
                    </Tabs>
                    {/* <div className="bank-info">
                        {!bank.id ? (
                            _renderEmptyState("bank")
                        ) : (
                            <div className="bank-information">
                                <div className="card">
                                    <span className="bank-name">
                                        {bank.bank_name}
                                    </span>

                                    <span className="account-num">
                                        {bank.account_number}
                                    </span>
                                </div>
                                <Popconfirm
                                    title="Are you sure you want to delete this bank?"
                                    getPopupContainer={() =>
                                        document.querySelector(
                                            ".bank-information"
                                        )
                                    }
                                    onConfirm={deleteBank}
                                    onCancel={() => {}}
                                    okText="Yes"
                                    cancelText="No">
                                    <Button className="custom-btn delete">
                                        Delete Bank
                                    </Button>
                                </Popconfirm>
                            </div>
                        )}
                    </div> */}
                </div>
                {/* <div className="card-info-container">
                    <h3>Card info</h3>
                    <div className="card-info">
                        {!card.id ? (
                            _renderEmptyState("card")
                        ) : (
                            <div className="card-information">
                                <div className="card">
                                    <span className="chip">
                                        <MicroChip />
                                    </span>
                                    <span className="last-four">
                                        **** **** **** {card.last_four}
                                    </span>
                                    <span className="brand-logo">
                                        {card.brand === "visa" ? (
                                            <VisaCard />
                                        ) : (
                                            <MasterCard />
                                        )}
                                    </span>
                                    <span className="card-bank">
                                        {card.bank}
                                    </span>
                                    <span className="expiry">
                                        {card.month}/{card.year}
                                    </span>
                                    <p>{_limitText(card.user.name, 25)}</p>
                                </div>
                                <Popconfirm
                                    title="Are you sure you want to delete this card?"
                                    getPopupContainer={() =>
                                        document.querySelector(
                                            ".card-information"
                                        )
                                    }
                                    onConfirm={deleteCard}
                                    onCancel={() => {}}
                                    okText="Yes"
                                    cancelText="No">
                                    <Button className="custom-btn delete">
                                        Delete Card
                                    </Button>
                                </Popconfirm>
                            </div>
                        )}
                    </div>
                </div> */}
            </div>

            <div className="drop-down-container full">
                <TableSelectFilters {...{ handler: () => {} }} />
            </div>
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
            <div className="pagination-container">
                <Pagination
                    total={transactions.total}
                    showSizeChanger={false}
                    hideOnSinglePage
                    {...{
                        onChange: onPaginationChange,
                        current: transactions.current_page
                    }}
                />
            </div>
        </motion.div>
    );
};

export default Wallet;
