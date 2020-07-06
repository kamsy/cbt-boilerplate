import { postFunc } from "./httpService";

const base_url = "http://zeus.test/api/";

const AuthServices = {
    loginService: payload => postFunc(`${base_url}login`, payload),
    registerService: payload => postFunc(`${base_url}register`, payload),
    forgotPasswordService: payload => postFunc(`${base_url}register`, payload)
};

export default AuthServices;
