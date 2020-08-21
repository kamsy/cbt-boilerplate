import { getFunc, delFunc } from "./httpService";
import { base_url } from "./authServices";

const CardServices = {
    getCardService: () => getFunc(`${base_url}user/cards`),
    initiateCardService: () => getFunc(`${base_url}user/card/initiate`),
    verifyCardService: ref => getFunc(`${base_url}user/card/verify/${ref}`),
    deleteCardService: () => delFunc(`${base_url}user/card`)
};

export default CardServices;
