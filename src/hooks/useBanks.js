import { useState, useEffect } from "react";
import BankServices from "../services/bankServices";

const useBanks = () => {
    const [banks, set_banks] = useState([]);
    const [banks_with_logos, set_banks_with_logos] = useState([]);
    const getBanks = async () => {
        const res = await BankServices.getBanksService();
        BankServices.getBanksWithLogosPaystackService().then(
            ({ status, data }) => {
                if (status === 200) {
                    set_banks_with_logos(data);
                }
            }
        );
        const { status, data } = res;
        if (status === 200) {
            set_banks(data?.banks || []);
        }
    };
    useEffect(() => {
        getBanks();
    }, []);

    return [banks, set_banks, getBanks, banks_with_logos];
};

export default useBanks;
