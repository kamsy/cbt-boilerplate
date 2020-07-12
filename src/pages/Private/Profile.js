import React, { useState } from "react";
import { motion } from "framer";
import {
    pageVariants,
    pageTransitions
} from "../../components/ProtectedLayout";
import { Tabs } from "antd";
import "../../scss/profile.scss";
import UserProfileInfo from "../../components/UserProfileInfo";
import ChangePassword from "../../components/ChangePassword";
import KinInfo from "../../components/KinInfo";
import { decryptAndRead } from "../../services/localStorageHelper";
import { ENCRYPT_USER } from "../../variables";
const { TabPane } = Tabs;

const Profile = () => {
    const [tab_key, set_tab_key] = useState(1);
    const { user_info } = decryptAndRead(ENCRYPT_USER);

    return (
        <motion.div
            className="main profile"
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransitions}
            variants={pageVariants}>
            <Tabs defaultActiveKey="1" onChange={key => set_tab_key(key)}>
                <TabPane tab="Profile" key="1">
                    <UserProfileInfo {...{ tab_key, user_info }} />
                </TabPane>
                <TabPane tab="Next of Kin" key="2">
                    <KinInfo {...{ tab_key, kin: user_info.kin }} />
                </TabPane>
                <TabPane tab="Change Password" key="3">
                    <ChangePassword {...{ tab_key }} />
                </TabPane>
            </Tabs>
        </motion.div>
    );
};

export default Profile;
