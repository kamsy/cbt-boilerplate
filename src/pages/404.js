import React from "react";
import { Link } from "react-router-dom";
import { url } from "../App";

const Page404 = () => (
    <div className="error-page">
        <span className="error-text-big">404</span>
        <span className="error-text-small">Page not found.</span>
        <Link to={`${url}dashboard`} className="link-to-dashboard">
            Go Home
        </Link>
    </div>
);

export default Page404;
