import React from "react";
import { Link } from "react-router-dom";
import { url } from "../App";
import { motion } from "framer";
import {
    auth_pageTransitions,
    auth_pageVariants
} from "../components/ProtectedLayout";

const Page404 = () => (
    <motion.div
        className="error-page"
        initial="initial"
        animate="in"
        exit="out"
        transition={auth_pageTransitions}
        variants={auth_pageVariants}>
        <span className="error-text-big">404</span>
        <span className="error-text-small">Page not found.</span>
        <Link to={`${url}dashboard`} className="link-to-dashboard">
            Go Home
        </Link>
    </motion.div>
);

export default Page404;
