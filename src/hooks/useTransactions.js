import { useState, useEffect } from "react";
import TransactionsServices from "../services/transactionsServices";

const useTransactions = () => {
    const [transactions, set_transactions] = useState([]);
    const getTransactions = ({ page = 1 }) => {
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        TransactionsServices.getTransactionsService({ page: page }).then(
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

    return [{ transactions, set_transactions, getTransactions }];
};

export default useTransactions;
