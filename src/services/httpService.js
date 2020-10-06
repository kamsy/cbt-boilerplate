import { decryptAndRead } from "./localStorageHelper";
import axios from "axios";
import { ENCRYPT_USER } from "../variables";

axios.interceptors.response.use(
    response => {
        // Do something with response data
        console.log("response", { response });
        return response;
    },
    error => {
        console.log("error", { error });
        if (error.response) {
            const { status, data } = error.response;
            if (status >= 500) {
                if (!window.location.pathname.includes("dashboard")) {
                    setTimeout(() => {
                        // history.push({ pathname: `${url}#/500` });
                    }, 1500);
                }
            } else if (status === 401 && data === "") {
            }
        }
        return Promise.reject(error);
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
    return new Promise((resolve, reject) => {
        axios
            .get(path, payload)
            .then(response => {
                return resolve(response);
            })
            .catch(({ response }) => {
                const { data, status } = response;
                return resolve({ data, status });
            });
    });
};

const delFunc = path => {
    return new Promise((resolve, reject) => {
        axios
            .delete(path)
            .then(response => {
                return resolve(response);
            })
            .catch(({ response }) => {
                const { data, status } = response;
                return resolve({ data, status });
            });
    });
};

const postFunc = (path, payload) => {
    return new Promise((resolve, reject) => {
        axios
            .post(path, payload)
            .then(response => {
                return resolve(response);
            })
            .catch(({ response }) => {
                const { data, status } = response;
                return resolve({ data, status });
            });
    });
};

const putFunc = (path, payload) => {
    return new Promise((resolve, reject) => {
        axios
            .put(path, payload)
            .then(response => {
                return resolve(response);
            })

            .catch(({ response }) => {
                const { data, status } = response;
                return resolve({ data, status });
            });
    });
};

export { getFunc, delFunc, postFunc, putFunc, axios };
