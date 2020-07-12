import { postFunc, getFunc, delFunc } from "./httpService";
const base_url = "http://134.209.31.250/api/";
const BankServices = {
    getBankService: () => getFunc(`${base_url}user/bank`),
    addBankService: payload => postFunc(`${base_url}user/bank`, payload),
    deleteBankService: () => delFunc(`${base_url}user/bank`),
    getBanksFromPaystackService: () => getFunc("https://api.paystack.co/bank"),
    getBanksWithLogosPaystackService: () => getFunc("https://nigerianbanks.xyz")
};

export default BankServices;
