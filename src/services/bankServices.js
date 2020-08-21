import { postFunc, getFunc, delFunc } from "./httpService";
import { base_url } from "./authServices";

const BankServices = {
    getBanksService: () => getFunc(`${base_url}user/banks`),
    addBankService: payload => postFunc(`${base_url}user/bank`, payload),
    deleteBankService: () => delFunc(`${base_url}user/bank`),
    getBanksFromPaystackService: () => getFunc("https://api.paystack.co/bank"),
    getBanksWithLogosPaystackService: () => getFunc("https://nigerianbanks.xyz")
};

export default BankServices;
