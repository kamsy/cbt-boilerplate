import { postFunc, getFunc } from "./httpService";
import { base_url } from "./authServices";

const BillServices = {
    getBillersService: () => getFunc(`${base_url}user/bills`),
    validateBillersService: payload =>
        postFunc(`${base_url}user/bills/validate`, payload),
    buyAirtimeService: payload =>
        postFunc(`${base_url}user/bills/airtime`, payload),
    buyDataService: payload => postFunc(`${base_url}user/bills/data`, payload)
};

export default BillServices;
