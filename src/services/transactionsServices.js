import { getFunc } from "./httpService";
import { base_url } from "./authServices";

const TransactionsServices = {
    getTransactionService: id => getFunc(`${base_url}user/transactions/${id}`),
    getTransactionsService: ({ page }) =>
        getFunc(`${base_url}user/transactions?page=${page}`)
};

export default TransactionsServices;
