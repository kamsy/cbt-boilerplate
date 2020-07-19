import { postFunc, getFunc } from "./httpService";
import { base_url } from "./authServices";

const LoanServices = {
    getLoanService: id => getFunc(`${base_url}loans/${id}`),
    getLoansService: ({ page }) => getFunc(`${base_url}loans?page=${page}`),
    applyForLoanService: payload => postFunc(`${base_url}loans/apply`, payload),
    payFullLoanService: id => postFunc(`${base_url}loans/pay/${id}/full`),
    payPartLoanService: ({ id, amount }) =>
        postFunc(`${base_url}loans/pay/${id}/part`, { amount })
};

export default LoanServices;
