import React, { useEffect, useState } from "react";
import "../scss/landing.scss";
import LandingHeader from "../components/LandingHeader";
import { Link } from "react-router-dom";
import { Button, Input, Select } from "antd";
import { fakeAuth, url } from "../App";
import CustomHistory from "../services/CustomHistory";
import IphoneX from "../assets/images/iphone-x.png";
import Illustration1 from "../assets/images/Illustration1.png";
import Illustration2 from "../assets/images/Illustration2.png";
import Illustration3 from "../assets/images/Illustration3.png";
import EllipsesSvg from "../assets/svgs/EllipsesSvg";
import Calculator from "../components/Calculator";

export default props => {
    useEffect(() => {
        const header = document.querySelector(".landing-page-header");
        window.addEventListener("scroll", () => {
            const scroll_pos = window.pageYOffset;
            if (scroll_pos > 50) {
                header.classList.add("show-bg");
            } else {
                header.classList.remove("show-bg");
            }
        });
        if (fakeAuth.isAuthenticated) {
            CustomHistory.goBack();
        }
    }, []);

    const _onChange = e => {
        const { value } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        if (
            (!isNaN(value) && reg.test(value)) ||
            value === "" ||
            value === "-"
        ) {
            _onChange(value);
        }
    };

    // '.' at the end or only '-' in the input box.
    const _onBlur = () => {
        const { value, onBlur, onChange } = props;
        let valueTemp = value;
        if (value.charAt(value.length - 1) === "." || value === "-") {
            valueTemp = value.slice(0, -1);
        }
        _onChange(valueTemp.replace(/0*(\d+)/, "$1"));
        if (onBlur) {
            _onBlur();
        }
    };
    return (
        <div className="landing-page">
            <LandingHeader />
            <div className="section-1">
                <div className="section-1-sub">
                    <h1>Getting loans just got easier</h1>
                    <p>
                        Apply for up to ₦100,000 with loan tenors of up to
                        90days and have your money sent straight to your bank
                        account in minutes.
                    </p>
                    <Button className="view-pricing-btn">View Pricing</Button>
                    <img
                        src={IphoneX}
                        alt="cropped iphone x"
                        className="iphone-ss"
                    />
                </div>
            </div>
            <div className="section-2">
                <div className="section-2-sub">
                    <span className="bubble" />
                    <span className="small-header">how it works</span>
                    <span className="process-header">
                        Fast & Easy Application Process
                    </span>
                    <div className="process-cards-container">
                        <div className="process-card">
                            <img
                                src={Illustration1}
                                alt="woman taking a selfie illustration"
                            />
                            <p>Create Account</p>
                            <span>
                                Register through our website, our MoneyPal app
                                or by chatting Zee on Whatsapp
                            </span>
                        </div>
                        <div className="process-card">
                            <img
                                src={Illustration2}
                                alt="man beside giant iphone x-series illustration"
                            />
                            <p>Apply for a loan</p>
                            <span>
                                Fill out our brief application form with your
                                information and we’ll review your application
                                within Five (5) minutes.
                            </span>
                        </div>
                        <div className="process-card">
                            <img
                                src={Illustration3}
                                alt="man spraying cash on a giant credit card illustration"
                            />
                            <p>Receive funds</p>
                            <span>
                                Once approved, funds are typically received
                                within 5 minutes.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section-3">
                <div className="ellipse-svg-cont">
                    <EllipsesSvg />
                </div>
                <div className="section-3-sub">
                    <h1>Simple & Fair Pricing</h1>
                    <p>
                        Quick Credit offers a super-fast loan solution without
                        paperwork and no delay to meet your urgent financial
                        needs within 24 hours.
                    </p>
                    <Link to={`${url}register`} className="to-register-link">
                        Get Started
                    </Link>
                    <Calculator />
                </div>
            </div>
            <div className="section-4"></div>
            <div className="section-5"></div>
            <div className="section-6"></div>
            <div className="section-7"></div>
            <div className="section-8"></div>
        </div>
    );
};
