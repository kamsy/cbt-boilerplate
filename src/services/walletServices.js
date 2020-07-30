import { postFunc, getFunc } from "./httpService";
import { base_url } from "./authServices";

const WalletServices = {
    getWalletService: () => getFunc(`${base_url}user/wallet`),
    fundWalletService: payload =>
        postFunc(`${base_url}user/wallet/fund`, payload)
};

export default WalletServices;
