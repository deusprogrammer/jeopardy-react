import { atom } from "jotai";

export const EMPTY_CARD_DATA = {
    card: null,
    category: null,
    cost: 0
}

export default atom(EMPTY_CARD_DATA);