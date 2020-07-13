import { postFunc, getFunc } from "./httpService";
import { base_url } from "./authServices";

const UserServices = {
    getUserService: () => getFunc(`${base_url}user`),
    updateUserService: () => postFunc(`${base_url}user`),
    getWalletService: () => getFunc(`${base_url}user/wallet`),
    addKinService: payload => postFunc(`${base_url}user/kin`, payload),
    getKinService: () => getFunc(`${base_url}user/kin`),
    addEmploymentService: payload =>
        postFunc(`${base_url}user/employment`, payload),
    getEmploymentService: () => getFunc(`${base_url}user/employment`),
    addAddressService: payload => postFunc(`${base_url}user/address`, payload),
    getAddressService: () => getFunc(`${base_url}user/address`)
};

export default UserServices;
