import React from "react";
import { motion } from "framer";
import { pageVariants } from "./ProtectedLayout";

const Dashboard = ({ children }) => {
    console.log("Dashboard -> children", children);
    return (
        <motion.div
            className="main"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}>
            {children}
        </motion.div>
    );
};

export default Dashboard;
