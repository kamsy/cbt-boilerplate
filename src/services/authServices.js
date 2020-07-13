import { postFunc } from "./httpService";
import { __DEV__ } from "./localStorageHelper";

export const base_url = __DEV__
    ? "http://134.209.31.250/api/"
    : "http://134.209.31.250/api/";

const AuthServices = {
    loginService: payload => postFunc(`${base_url}login`, payload),
    registerService: payload => postFunc(`${base_url}register`, payload),
    forgotPasswordService: payload => postFunc(`${base_url}register`, payload)
};

export default AuthServices;
