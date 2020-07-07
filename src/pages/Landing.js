import React, { useEffect } from "react";
import "../scss/landing.scss";
import LandingHeader from "../components/LandingHeader";
import { Link } from "react-router-dom";
import { Button, Collapse } from "antd";
import { url } from "../App";
import IphoneX from "../assets/images/iphone-x.png";
import Illustration1 from "../assets/images/Illustration1.png";
import Illustration2 from "../assets/images/Illustration2.png";
import Illustration3 from "../assets/images/Illustration3.png";
import EllipsesSvg from "../assets/svgs/EllipsesSvg";
import Calculator from "../components/Calculator";
import Puzzle from "../assets/svgs/Puzzle";
import PaintBrush from "../assets/svgs/PaintBrush";
import SandClock from "../assets/svgs/SandClock";
import Dial from "../assets/svgs/Dial";
import TracedPathSvg from "../assets/svgs/TracedPathSvg";
import { motion } from "framer";
import { pageTransitions } from "../components/ProtectedLayout";

const { Panel } = Collapse;

export default ({}) => {
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
    }, []);

    return (
        <motion.div
            className="landing-page"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={{
                initial: {
                    opacity: 0
                },
                in: {
                    y: 0,
                    opacity: 1
                },
                out: {
                    opacity: 0
                }
            }}>
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
                    <span className="small-text">how it works</span>
                    <span className="big-text">
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
            <div className="section-4">
                <div className="floating-text">
                    <span>Quick Credit</span>
                </div>
                <div className="section-4-sub">
                    <span className="small-text">Best Software</span>
                    <span className="big-text">Why Choose Us</span>

                    <div className="reason-container">
                        <div className="top">
                            <div className="reason">
                                <Puzzle />
                                <p>We're flexible</p>
                                <span>
                                    You can save interest by repaying your short
                                    term loan early. If things go wrong, we're
                                    here to help you.
                                </span>
                            </div>
                            <div className="reason">
                                <PaintBrush />
                                <p>We're committed to you</p>
                                <span>
                                    Easy navigation and user experience. Access
                                    to QuickCredit services with ease.
                                </span>
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="reason">
                                <SandClock />
                                <p>We're transparent</p>
                                <span>
                                    There are no hidden charges. We make all our
                                    fees completely clear upfront before you
                                    apply.
                                </span>
                            </div>
                            <div className="reason">
                                <Dial />
                                <p>We're here to help</p>
                                <span>
                                    Get extensive details of requested loan
                                    facility real-time.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section-5">
                <div className="traced-path-cont">
                    <TracedPathSvg />
                </div>
                <div className="links-to-stores"></div>
            </div>
            <div className="section-6">
                <span className="small-text">FAQ</span>
                <span className="big-text">Frequently Asked Questions</span>
                <span className="bubble" />
                <Collapse
                    accordion
                    expandIconPosition="right"
                    bordered={false}
                    expandIcon={() => {}}>
                    <Panel header="What is QuickCredit?" key="1">
                        <p>a</p>
                    </Panel>
                    <Panel header="What is the minimum loan amount?" key="2">
                        <p>b</p>
                    </Panel>
                    <Panel header="What is the maximum loan amount" key="3">
                        <p>c</p>
                    </Panel>
                    <Panel
                        header="What is the maximum tenure for QuickCredit"
                        key="4">
                        <p>d</p>
                    </Panel>
                </Collapse>
                <Link to={`${url}register`} className="push-to-reg">
                    How can I access the Quick Credit loan?
                </Link>
            </div>
            <div className="section-7"></div>
            <div className="section-8"></div>
        </motion.div>
    );
};
