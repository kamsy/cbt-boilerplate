import { postFunc, getFunc, delFunc } from "./httpService";
import { base_url } from "./authServices";

const BankServices = {
    getBankService: () => getFunc(`${base_url}user/bank`),
    addBankService: payload => postFunc(`${base_url}user/banks`, payload),
    deleteBankService: () => delFunc(`${base_url}user/bank`),
    getBanksFromPaystackService: () => getFunc("https://api.paystack.co/bank"),
    getBanksWithLogosPaystackService: () => getFunc("https://nigerianbanks.xyz")
};

export default BankServices;
