import { useState, useEffect } from "react";
import TransactionsServices from "../services/transactionsServices";
import WalletServices from "../services/walletServices";

const useWallet = () => {
    const [wallet, set_wallet] = useState([]);
    const getWallet = async () => {
        const res = await WalletServices.getWalletService();
        const { status, data } = res;
        if (status === 200) {
            set_wallet(data?.wallet || {});
        }
    };

    useEffect(() => {
        getWallet();
    }, []);

    return [{ getWallet, set_wallet, wallet }];
};

export default useWallet;
