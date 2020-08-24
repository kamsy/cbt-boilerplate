import { getFunc, delFunc } from "./httpService";
import { base_url } from "./authServices";

const CardServices = {
    getCardsService: () => getFunc(`${base_url}user/cards`),
    initiateCardService: () => getFunc(`${base_url}user/cards/initiate`),
    verifyCardService: ref => getFunc(`${base_url}user/cards/verify/${ref}`),
    deleteCardService: id => delFunc(`${base_url}user/cards/${id}`)
};

export default CardServices;
