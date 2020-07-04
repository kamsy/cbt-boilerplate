import React from "react";
import { motion } from "framer";
import { pageVariants } from "../../components/ProtectedLayout";

const Payments = () => {
    return (
        <motion.div
            className="main"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}>
            payments
        </motion.div>
    );
};

export default Payments;
