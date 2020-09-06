import { useState } from "react";
import CardServices from "../services/cardServices";
import useCards from "./useCards";
import { NotifySuccess } from "../components/Notification";

const useDeleteCard = ({ set_cards }) => {
    const [{ cards }] = useCards();
    const [item_to_delete_info, set_item_to_delete_info] = useState({});
    const [open_confirm_modal, set_open_confirm_modal] = useState(false);

    const deleteCard = async id => {
        window._toggleLoader();
        const res = await CardServices.deleteCardService(id);
        setTimeout(() => {
            window._toggleLoader();
        }, 500);
        const { status, data } = res;
        if (status === 200) {
            NotifySuccess(data.message);
            const cards_arr = [...cards];
            const index_of_bank = cards_arr.findIndex(card => card.id === id);
            cards_arr.splice(index_of_bank, 1);
            set_cards(cards_arr);
        }
    };

    const toggleConfirmActionModal = data => {
        set_item_to_delete_info(data);
        set_open_confirm_modal(true);
    };

    return [
        {
            deleteCard,
            toggleConfirmActionModal,
            item_to_delete_info,
            open_confirm_modal,
            set_open_confirm_modal,
            set_item_to_delete_info
        }
    ];
};

export default useDeleteCard;
