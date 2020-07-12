import { postFunc } from "./httpService";

const base_url = "http://134.209.31.250/api/";

const AuthServices = {
    loginService: payload => postFunc(`${base_url}login`, payload),
    registerService: payload => postFunc(`${base_url}register`, payload),
    forgotPasswordService: payload => postFunc(`${base_url}register`, payload)
};

export default AuthServices;
