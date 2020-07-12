import { postFunc, getFunc } from "./httpService";

const base_url = "http://134.209.31.250/api/";

const UserServices = {
    getUserService: () => getFunc(`${base_url}user`),
    updateUserService: () => postFunc(`${base_url}user`),
    getWalletService: () => getFunc(`${base_url}wallet`),
    addKinService: payload => postFunc(`${base_url}user/kin`, payload),
    getKinService: () => getFunc(`${base_url}user/kin`),
    addEmploymentService: payload =>
        postFunc(`${base_url}user/employment`, payload),
    getEmploymentService: () => getFunc(`${base_url}user/employment`),
    addAddressService: payload => postFunc(`${base_url}user/address`, payload),
    getAddressService: () => getFunc(`${base_url}user/address`)
};

export default UserServices;