import { postFunc, getFunc } from "./httpService";
import { base_url } from "./authServices";

const BillServices = {
    getBillersService: () => getFunc(`${base_url}user/bills`),
    validateBillersService: payload =>
        postFunc(`${base_url}user/bills/validate`, payload),
    buyAirtimeService: payload =>
        postFunc(`${base_url}user/bills/airtime`, payload),
    buyDataService: payload => postFunc(`${base_url}user/bills/data`, payload),
    t: payload =>
        getFunc(
            "https://flexitedu.iposbi.com/api/sponsorgroup/SponsorGroup/GetPaymentPlanBySponsor?pageIndex=0&pageSize=10"
        )
};

export default BillServices;
