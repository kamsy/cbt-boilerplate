import { EXPIRY } from "../variables";
const CryptoJS = require("crypto-js");
const { localStorage } = window;
window.__DEV__ = process.env.NODE_ENV === "development";

const secret =
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
        ? process.env.HASH_SECRET
        : process.env.HASH_SECRET;

const storer = (key, value) => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(value), secret);
    return localStorage.setItem(key, ciphertext);
};

export const encryptAndStore = (key, value, expiry = false) => {
    if (expiry === true) {
        localStorage.setItem(
            EXPIRY,
            new Date()
                .setTime(new Date().getTime() + value.expires_in * 1000)
                .toString()
        );
        storer(key, value);
    }
    storer(key, value);
};

export const decryptAndRead = key => {
    const expiry = localStorage.getItem(EXPIRY);
    const fromStorage = localStorage.getItem(key);
    if (
        fromStorage !== null &&
        fromStorage !== undefined &&
        fromStorage !== "" &&
        new Date().getTime() > expiry
    ) {
        const bytes = CryptoJS.AES.decrypt(fromStorage.toString(), secret);
        const response = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return { ...response, expired: true };
    } else if (
        fromStorage !== null &&
        fromStorage !== undefined &&
        fromStorage !== "" &&
        new Date().getTime() < expiry
    ) {
        const bytes = CryptoJS.AES.decrypt(fromStorage.toString(), secret);
        const response = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return { ...response, expired: false };
    } else {
        return null;
    }
};

export const clear = () => {
    const theme = localStorage.getItem("theme");
    localStorage.clear();
    localStorage.setItem("theme", theme);
    return null;
};

const localStoreSet = ({ key, value }) => localStorage.setItem(key, value);
const localStoreGet = key => localStorage.getItem(key);

export { localStoreSet, localStoreGet };
