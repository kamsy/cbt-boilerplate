import { decryptAndRead } from "./localStorageHelper";
import axios from "axios";
import { ENCRYPT_USER } from "../variables";
// import { NotifyClose, NotifyError } from "../../reuse/Notify";

axios.interceptors.response.use(
    response => {
        // Do something with response data
        console.log("response", response);
        return response;
    },
    error => {
        // const history = useHistory();
        console.log("error", error);
        if (error.response) {
            const { status, data } = error.response;
            if (status >= 500) {
                if (!window.location.pathname.includes("dashboard")) {
                    setTimeout(() => {
                        // history.push({ pathname: `${url}#/500` });
                    }, 1500);
                }
            } else if (status === 401 && data === "") {
                // store.dispatch(Actions.logoutUser());
                // const decryptedToken = decryptAndRead(ENCRYPT_USER);
                // const expiry = localStorage.getItem(EXPIRY);
                // if (!decryptedToken) {
                // } else if (decryptedToken) {
                //     const { access_token, expired } = decryptedToken;
                //     if (
                //         expired &&
                //         new Date().getTime() < Number(expiry) + 3600000
                //     ) {
                //         store.dispatch(Actions.onInit());
                //     } else if (
                //         expired &&
                //         new Date().getTime() > Number(expiry) + 3600000
                //     ) {
                //         store.dispatch(Actions.logoutUser());
                //     }
                //     return new Promise(resolve => {
                //         error.config.headers.Authorization =
                //             "Bearer " + access_token;
                //         resolve(axios(error.config));
                //     });
                // }
            }
        }
        return error;
    }
);

axios.interceptors.request.use(config => {
    const decryptedToken = decryptAndRead(ENCRYPT_USER);
    if (decryptedToken) {
        const { token, expired } = decryptedToken;
        if (!expired) {
            config.headers[
                "Authorization"
            ] = `Bearer VPWaJ3o0XKgKuDaCWy3KZ9DW7QkIJOwqHcdjUKTSh-E`;
        }
    }
    config.headers["Accept"] = "application/json";
    return config;
});

const getFunc = (path, payload) => {
    return new Promise((resolve, reject) => {
        axios
            .get(path, payload)
            .then(response => {
                console.log("postFunc -> res", response);
                return resolve(response);
            })
            .catch(({ response }) => {
                console.log("postFunc -> response", response);
                return reject(response);
            });
    });
};

const delFunc = path => {
    return new Promise((resolve, reject) => {
        axios
            .delete(path)
            .then(response => {
                console.log("postFunc -> res", response);
                return resolve(response);
            })
            .catch(({ response }) => {
                console.log("postFunc -> response", response);
                return reject(response);
            });
    });
};

const postFunc = (path, payload) => {
    return new Promise((resolve, reject) => {
        axios
            .post(path, payload)
            .then(response => {
                console.log("postFunc -> res", response);
                return resolve(response);
            })
            .catch(({ response }) => {
                console.log("postFunc -> response", response);
                return reject(response);
            });
    });
};

export { getFunc, delFunc, postFunc, axios };
