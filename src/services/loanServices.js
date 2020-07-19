import { postFunc, getFunc } from "./httpService";
import { base_url } from "./authServices";

const LoanServices = {
    getLoanService: id => getFunc(`${base_url}loans/${id}`),
    getLoansService: () => getFunc(`${base_url}loans`),
    applyForLoanService: payload => postFunc(`${base_url}loans/apply`, payload),
    payFullLoanService: id => postFunc(`${base_url}loans/pay/${id}/full`),
    payPartLoanService: ({ id, payload }) =>
        postFunc(`${base_url}loans/pay/${id}/part`, payload)
};

export default LoanServices;
