import { postFunc, updateFunc } from "./httpService";
import { base_url } from "./authServices";

const PinServices = {
    createPinService: payload => {
        return postFunc(`${base_url}user/pin`, payload);
    },
    verifyPinService: payload => {
        return postFunc(`${base_url}user/pin/verify`, payload);
    },
    updatePinService: payload => {
        return updateFunc(`${base_url}user/pin`, payload);
    }
};

export default PinServices;
