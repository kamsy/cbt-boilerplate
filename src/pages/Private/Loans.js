import React from "react";
import { motion } from "framer";
import { pageVariants } from "../../components/ProtectedLayout";

const Loans = () => {
    return (
        <motion.div
            className="main"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}>
            loans
        </motion.div>
    );
};

export default Loans;
