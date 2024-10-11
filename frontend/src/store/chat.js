import { atom } from "recoil";

export const ChatAtom = atom({
    key: 'ChatAtom',
    default: []
})

export const SelectedChatAtom = atom({
    key: 'SelectedChatAtom',
    default: null
})


export const FetchAtom = atom({
    key: 'FetchAtom',
    default: false
})