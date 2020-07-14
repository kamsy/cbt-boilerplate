import { postFunc } from "./httpService";

export const base_url = "https://api.gbasgbos.xyz/api/";

const AuthServices = {
    loginService: payload => postFunc(`${base_url}login`, payload),
    registerService: payload => postFunc(`${base_url}register`, payload),
    forgotPasswordService: payload => postFunc(`${base_url}register`, payload)
};

export default AuthServices;
