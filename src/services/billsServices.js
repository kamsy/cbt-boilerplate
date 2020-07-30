import { postFunc, getFunc } from "./httpService";
import { base_url } from "./authServices";

const BillServices = {
    getBillersService: () => getFunc(`${base_url}user/bills`),
    validateBillersService: payload =>
        postFunc(`${base_url}user/bills/validate`, payload)
};

export default BillServices;
