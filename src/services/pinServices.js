import { postFunc, putFunc } from "./httpService";
import { base_url } from "./authServices";

const PinServices = {
    createPinService: payload => {
        return postFunc(`${base_url}user/pin`, payload);
    },
    verifyPinService: payload => {
        return postFunc(`${base_url}user/pin/verify`, payload);
    },
    updatePinService: payload => {
        return putFunc(`${base_url}user/pin`, payload);
    }
};

export default PinServices;
