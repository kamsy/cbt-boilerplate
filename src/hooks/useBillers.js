import { useState, useEffect } from "react";
import BillServices from "../services/billsServices";

const useBillers = () => {
    const [billers, set_billers] = useState([]);

    const getBillers = (page = 1) => {
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        BillServices.getBillersService({ page: page }).then(
            ({ status, data }) => {
                setTimeout(() => {
                    window._toggleLoader();
                }, 500);
                if (status === 200) {
                    set_billers(data || []);
                }
            }
        );
    };
    useEffect(() => {
        getBillers();
    }, []);

    return [{ billers, set_billers, getBillers }];
};

export default useBillers;
