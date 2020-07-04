import { decryptAndRead } from "./localStorageHelper";
import { history } from "../../reuse/history";
import { ENCRYPT_USER, EXPIRY } from "../arsVariables";
import { store } from "../index";
import { Actions } from "../actions/_index";
import axios from "axios";
import { url } from "../App";
import { NotifyClose, NotifyError } from "../../reuse/Notify";

axios.interceptors.response.use(
    response => {
        // Do something with response data
        return response;
    },
    error => {
        if (error.response) {
            const { status, data } = error.response;
            if (status >= 500) {
                if (!window.location.pathname.includes("dashboard")) {
                    setTimeout(() => {
                        history.push({ pathname: `${url}#/500` });
                    }, 1500);
                }
            } else if (status === 401 && data === "") {
                store.dispatch(Actions.logoutUser());
                const decryptedToken = decryptAndRead(ENCRYPT_USER);

                const expiry = localStorage.getItem(EXPIRY);
                if (!decryptedToken) {
                } else if (decryptedToken) {
                    const { access_token, expired } = decryptedToken;
                    if (
                        expired &&
                        new Date().getTime() < Number(expiry) + 3600000
                    ) {
                        store.dispatch(Actions.onInit());
                    } else if (
                        expired &&
                        new Date().getTime() > Number(expiry) + 3600000
                    ) {
                        store.dispatch(Actions.logoutUser());
                    }
                    return new Promise(resolve => {
                        error.config.headers.Authorization =
                            "Bearer " + access_token;
                        resolve(axios(error.config));
                    });
                }
            }
        }
        return Promise.reject({ error });
    }
);

axios.interceptors.request.use(config => {
    const decryptedToken = decryptAndRead(ENCRYPT_USER);
    if (decryptedToken) {
        const { token, expired } = decryptedToken;
        if (!expired) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
    }
    return config;
});

const getFunc = (path, payload) => {
    NotifyClose();
    return new Promise((resolve, reject) => {
        axios
            .get(path, payload)
            .then(res => {
                return resolve({ ...res, error: false });
            })
            .catch(error => {
                if (!error.error) {
                    store.dispatch(Actions.miniUiStop());
                    store.dispatch(Actions.uiStop());
                    return NotifyError(error.message);
                }
                return reject({ error: true, response: error });
            });
    });
};

const delFunc = path => {
    NotifyClose();
    return new Promise((resolve, reject) => {
        axios
            .delete(path)
            .then(res => {
                return resolve({ ...res, error: false });
            })
            .catch(error => {
                if (!error.error) {
                    store.dispatch(Actions.miniUiStop());
                    store.dispatch(Actions.uiStop());
                    return NotifyError(error.message);
                }
                return reject({ error: true, response: error });
            });
    });
};

const postFunc = (path, payload) => {
    NotifyClose();
    return new Promise((resolve, reject) => {
        axios
            .post(path, payload)
            .then(res => {
                return resolve({ ...res, error: false });
            })
            .catch(error => {
                if (!error.error) {
                    store.dispatch(Actions.miniUiStop());
                    store.dispatch(Actions.uiStop());
                    return NotifyError(error.message);
                }
                return reject({ error: true, response: error });
            });
    });
};

export { getFunc, delFunc, postFunc, axios };
