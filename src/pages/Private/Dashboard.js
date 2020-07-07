import React from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";

const Dashboard = () => {
    return (
        <motion.div
            className="main dashboard"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            dashboard
        </motion.div>
    );
};

export default Dashboard;
