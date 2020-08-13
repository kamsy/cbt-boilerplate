import React, { useState, useEffect } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { _formatMoney, _limitText } from "../../services/utils";
import { Button, Popconfirm, Select, Pagination } from "antd";
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
const { Option } = Select;
const moment = new MomentAdapter();

const Wallet = () => {
    const { user_info } = decryptAndRead(ENCRYPT_USER);
    const [open_modal, set_open_modal] = useState(false);
    const [open_fund_wallet_modal, set_open_fund_wallet_modal] = useState(
        false
    );
    const [banks, set_banks] = useState([]);
    const [bank, set_bank] = useState({});
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

    const _renderEmptyState = tab => (
        <div className="empty-state">
            <span>
                You have not added a {tab},<br /> Click the button below to add
                a {tab}.
            </span>
            {tab === "card" ? (
                <PaystackConsumer {...componentProps}>
                    {({ initializePayment }) => (
                        <Button
                            className="custom-btn"
                            onClick={initializePayment}>
                            Add Card
                        </Button>
                    )}
                </PaystackConsumer>
            ) : (
                <Button
                    className="custom-btn"
                    onClick={() => {
                        banks.length === 0 &&
                            BankServices.getBanksWithLogosPaystackService().then(
                                ({ status, data }) => {
                                    if (status === 200) {
                                        set_banks(data);
                                    }
                                }
                            );

                        return set_open_modal(true);
                    }}>
                    Add Bank
                </Button>
            )}
        </div>
    );

    const getBank = () => {
        BankServices.getBankService().then(({ status, data }) => {
            if (status === 200) {
                set_bank(data?.bank || {});
            }
        });
    };

    const getCard = () => {
        CardServices.getCardService().then(({ status, data }) => {
            if (status === 200) {
                set_card(data?.card || {});
            }
        });
    };

    const getWallet = () => {
        WalletServices.getWalletService().then(({ status, data }) => {
            if (status === 200) {
                set_wallet(data?.wallet || {});
            }
        });
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
            set_bank({});
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
            set_card({});
        }
    };

    const onFundWallet = () => set_open_fund_wallet_modal(true);

    useEffect(() => {
        getCard();
        getBank();
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

    return (
        <motion.div
            className="main wallet shared-modal-comp"
            id="wallet-history"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <AddBankModal {...{ open_modal, set_open_modal, banks, getBank }} />
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
                <div className="bank-info-container">
                    <h3>Bank info</h3>
                    <div className="bank-info">
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
                    </div>
                </div>
                <div className="card-info-container">
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
                </div>
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
