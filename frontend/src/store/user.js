import { atom } from 'recoil'


export const UserAtom = atom({
    key: 'User',
    default: JSON.parse(localStorage.getItem('user-info'))

})
