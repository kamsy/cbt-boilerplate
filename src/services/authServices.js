import { postFunc } from "./httpService";

export const base_url = "https://api.godwhen.xyz/api/";

const AuthServices = {
    loginService: payload => postFunc(`${base_url}login`, payload),
    registerService: payload => postFunc(`${base_url}register`, payload),
    forgotPasswordService: payload =>
        postFunc(`${base_url}pre-forgot`, payload),
    resetPasswordService: payload => postFunc(`${base_url}post-forgot`, payload)
};

export default AuthServices;
