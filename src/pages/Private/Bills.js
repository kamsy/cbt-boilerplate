import React, { useState, useEffect } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { _formatMoney } from "../../services/utils";
import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Input, Pagination } from "antd";
import { Link } from "react-router-dom";
import "../../scss/loans.scss";
import { url } from "../../App";
import LoanServices from "../../services/loanServices";
import MomentAdapter from "@date-io/moment";
import { NotifySuccess } from "../../components/Notification";
import PartRepaymentModal from "../../components/Modals/PartRepaymentModal";
import ViewLoanModal from "../../components/Modals/ViewLoanModal";
import EmptyTable from "../../components/EmptyTable";
import BillServices from "../../services/billsServices";

const { Search } = Input;
const moment = new MomentAdapter();

const Bills = () => {
    const menu = ({
        id,
        approved,
        reviewed,
        repaid_loan,
        repay_amount,
        paid,
        duration,
        amount,
        rejected,
        due,
        created_at,
        rejection_reason
    }) => (
        <Menu>
            <Menu.Item key="1" onClick={() => {}}>
                View
            </Menu.Item>
        </Menu>
    );

    const [loans, set_billers] = useState({});
    const [open_input_modal, set_open_input_modal] = useState(false);
    const [open_loan_detail_modal, set_open_loan_detail_modal] = useState(
        false
    );
    const [loan_info, set_loan_info] = useState({});

    const getBillers = ({ page }) => {
        setTimeout(() => {
            window._toggleLoader();
        }, 100);
        BillServices.getBillersService({ page }).then(({ status, data }) => {
            console.log("getBillers -> data", data);
            setTimeout(() => {
                window._toggleLoader();
            }, 500);
            if (status === 200) {
                set_billers(data.loans || {});
            }
        });
    };

    const onPaginationChange = page => getBillers({ page });

    useEffect(() => {
        getBillers({ page: 1 });
    }, []);
    return (
        <motion.div
            className="main bills"
            id="bills-history"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <div className="search-container full">
                <Search
                    placeholder="Search loans by username or fullname"
                    size="large"
                    enterButton="search"
                    onSearch={value => console.log(value)}
                />
            </div>
        </motion.div>
    );
};

export default Bills;
