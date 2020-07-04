import React from "react";
import { motion } from "framer";
import { pageVariants } from "../../components/ProtectedLayout";

const Dashboard = () => {
    return (
        <motion.div
            className="main"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}>
            dashboard
        </motion.div>
    );
};

export default Dashboard;
