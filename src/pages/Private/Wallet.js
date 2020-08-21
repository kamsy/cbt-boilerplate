import React, { useState, useEffect } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { _formatMoney, _limitText } from "../../services/utils";
import { Button, Popconfirm, Pagination, Tabs } from "antd";
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
import TransactionsServices from "../../services/transactionsServices";
import EmptyTable from "../../components/EmptyTable";
import TableSelectFilters from "../../components/TableSelectFIlters";
import ConfirmActionModal from "../../components/Modals/ConfirmActionModal";

const moment = new MomentAdapter();

const { TabPane } = Tabs;

const Wallet = () => {
    const { user_info } = decryptAndRead(ENCRYPT_USER);
    const [open_confirm_modal, set_open_confirm_modal] = useState(false);
    const [item_to_delete_info, set_item_to_delete_info] = useState({});
    const [open_modal, set_open_modal] = useState(false);
    const [open_fund_wallet_modal, set_open_fund_wallet_modal] = useState(
        false
    );
    const [banks_with_logos, set_banks_with_logos] = useState([]);
    const [banks, set_banks] = useState([]);
    const [cards, set_cards] = useState([]);
    const [card, set_card] = useState({});
    const [wallet, set_wallet] = useState({});

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
                        set_card(data.card);
                    }
                    setTimeout(() => {
                        window._toggleLoader();
                    }, 500);
                }
            );
        },
        onClose: e => console.log(e)
    };

    const getBanks = async () => {
        const res = await BankServices.getBanksService();
        const { status, data } = res;
        console.log("getBanks -> data", data);
        if (status === 200) {
            set_banks(data?.banks || []);
        }
    };

    const getCards = async () => {
        const res = await CardServices.getCardsService();
        const { status, data } = res;
        console.log("getCards -> res", res);
        if (status === 200) {
            set_cards(data?.cards || []);
        }
    };

    const getWallet = async () => {
        const res = await WalletServices.getWalletService();
        const { status, data } = res;
        if (status === 200) {
            set_wallet(data?.wallet || {});
        }
    };

    const deleteBank = async () => {
        window._toggleLoader();
        const res = await BankServices.deleteBankService();
        setTimeout(() => {
            window._toggleLoader();
        }, 500);
        const { status, data } = res;
        if (status === 200) {
            NotifySuccess(data.message);
            // set_banks();
        }
    };

    const deleteCard = async () => {
        window._toggleLoader();
        const res = await CardServices.deleteCardService();
        setTimeout(() => {
            window._toggleLoader();
        }, 500);
        const { status, data } = res;
        if (status === 200) {
            NotifySuccess(data.message);
            // set_card({});
        }
    };

    const onFundWallet = () => set_open_fund_wallet_modal(true);

    useEffect(() => {
        getCards();
        getBanks();
        getWallet();
        getTransactions({ page: 1 });
    }, []);

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

    const onPaginationChange = page => getTransactions({ page });

    const toggleConfirmActionModal = data => {
        console.warn("clicked");
        set_item_to_delete_info(data);
        set_open_confirm_modal(true);
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
                    open_fund_wallet_modal,
                    set_open_fund_wallet_modal,
                    getWallet,
                    getTransactions
                }}
            />
            <div className="top-section">
                <div className="wallet-info-container">
                    <h3>Quick Credit Wallet</h3>
                    <div className="wallet-info">
                        <div className="card">
                            <span className="balance">Balance</span>
                            <p>{_formatMoney(wallet.amount / 100)}</p>
                        </div>
                        <Button className="custom-btn" onClick={onFundWallet}>
                            Fund Wallet
                        </Button>
                    </div>
                </div>
                <div className="bank-card-info-container">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Bank" key="1">
                            <div className="add-card card-cont">
                                <Button
                                    className="custom-btn"
                                    onClick={() => {
                                        BankServices.getBanksWithLogosPaystackService().then(
                                            ({ status, data }) => {
                                                if (status === 200) {
                                                    set_banks_with_logos(data);
                                                }
                                            }
                                        );

                                        return set_open_modal(true);
                                    }}>
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
                                                        type: "card",
                                                        card_number: `**** **** ****${card.last_four}`,
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
