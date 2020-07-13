import React, { useState, useEffect } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { _formatMoney, _limitText } from "../../services/utils";
import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Tabs, Button, Popconfirm } from "antd";
import { Link, useParams } from "react-router-dom";
import "../../scss/loan.scss";
import { PaystackConsumer } from "react-paystack";
import { url } from "../../App";
import { decryptAndRead } from "../../services/localStorageHelper";
import { ENCRYPT_USER } from "../../variables";
import BankServices from "../../services/bankServices";
import AddBankModal from "../../components/Modals/AddBankModal";
import { NotifySuccess } from "../../components/Notification";
import UserServices from "../../services/userServices";
import LoanServices from "../../services/loanServices";
import format from "date-fns/format";
import CardServices from "../../services/cardServices";
import VisaCard from "../../assets/svgs/VisaCard";
import MasterCard from "../../assets/svgs/MasterCard";
import MicroChip from "../../assets/svgs/MicroChip";

const { TabPane } = Tabs;

const Loans = () => {
    const { id } = useParams();

    const [open_modal, set_open_modal] = useState(false);
    const [loan, set_loan] = useState({});

    const getLoan = () => {
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        LoanServices.getLoanService(id).then(({ status, data }) => {
            console.log("getLoan -> status", status);
            console.log("getLoan -> data", data);
            setTimeout(() => {
                window._toggleLoader();
            }, 500);
            if (status === 200) {
                set_loan(data.loan || {});
            }
        });
    };

    useEffect(() => {
        getLoan();
    }, []);
    return (
        <motion.div
            className="main loan"
            id="loan-history"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}></motion.div>
    );
};

export default Loans;
