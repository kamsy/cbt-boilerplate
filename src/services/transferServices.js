import { postFunc } from "./httpService";
import { base_url } from "./authServices";

const TransferServices = {
    verifyBankAccountService: payload =>
        postFunc(`${base_url}user/bank/lookup`, payload),
    transferToBankService: payload =>
        postFunc(`${base_url}user/bank/transfer`, payload),
    transferToWalletService: payload =>
        postFunc(`${base_url}user/wallet/send`, payload)
};

export default TransferServices;
