import { useState, useEffect } from "react";
import CardServices from "../services/cardServices";

const useCards = () => {
    const [cards, set_cards] = useState([]);
    const getCards = async () => {
        const res = await CardServices.getCardsService();
        const { status, data } = res;
        if (status === 200) {
            set_cards(data?.cards || []);
        }
    };
    useEffect(() => {
        getCards();
    }, []);

    return [cards, set_cards];
};

export default useCards;
