import React, { useState } from "react";
import { motion } from "framer";
import { pageVariants } from "../../components/ProtectedLayout";
import { Tabs } from "antd";
import "../../scss/profile.scss";
import UserProfileInfo from "../../components/UserProfileInfo";
import ChangePassword from "../../components/ChangePassword";
import KinInfo from "../../components/KinInfo";
const { TabPane } = Tabs;

const Profile = () => {
    const [tab_key, set_tab_key] = useState(1);

    return (
        <motion.div
            className="main profile"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}>
            <Tabs defaultActiveKey="1" onChange={key => set_tab_key(key)}>
                <TabPane tab="Profile" key="1">
                    <UserProfileInfo {...{ tab_key }} />
                </TabPane>
                <TabPane tab="Next of Kin" key="2">
                    <KinInfo {...{ tab_key }} />
                </TabPane>
                <TabPane tab="Change Password" key="3">
                    <ChangePassword {...{ tab_key }} />
                </TabPane>
            </Tabs>
        </motion.div>
    );
};

export default Profile;
