import React from "react";
import NumberFormat from "react-number-format";

const capitalizer = text => {
    const labelText = text.split(" ");
    let formattedText = [];
    labelText.forEach(t =>
        formattedText.push(t.substring(0, 1).toUpperCase() + t.substring(1))
    );
    return formattedText.join(" ");
};

const stateMapper = (objectToMap, el = this) => {
    const keysArr = Object.keys(objectToMap);
    const valuesArr = Object.values(objectToMap);
    keysArr.forEach((key, i) =>
        el.setState(prev => {
            return {
                ...prev,
                data: {
                    ...prev.data,
                    [key]: {
                        ...prev[key],
                        value: valuesArr[i] || ""
                    }
                },
                errors: {
                    ...prev.errors,
                    [key]: valuesArr[i] ? "" : prev.errors[key]
                },
                empties: {
                    ...prev.empties,
                    [key]: valuesArr[i] ? "" : prev.empties[key]
                }
            };
        })
    );
};

export const secureCardNumber = text => {
    // code to display the phone number like this 090******123
    const sliced = text.slice(3, text.length - 3);
    return text.replace(sliced, "*".repeat(sliced.length));
};

const _digitsValidator = (input, el = this, name) => {
    const re = /^\d+$/;
    const digit = input.toString().trim();
    const validDigit = re.test(digit);
    if (validDigit) {
        el.setState(prevState => {
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    [name]: {
                        ...prevState[name],
                        value: digit,
                        valid: validDigit
                    }
                },
                errors: {
                    ...prevState.errors,
                    [name]: `${name} must be a number`
                }
            };
        });
    } else {
        const errorsArr = el.state.errors;
        delete errorsArr[name];
        el.setState(prevState => {
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    [name]: {
                        ...prevState[name],
                        value: digit,
                        valid: validDigit
                    }
                },
                errors: {
                    ...errorsArr
                }
            };
        });
    }
};

const _phoneHandler = (input, el = this) => {
    const re = /^((\d{8,9})|[0]?\d([7](?=0)|[8](?=0|1)|[9](?=0))\d{9}(?!\d))$/;
    const telephone = input.trim();
    const validPhone = re.test(telephone);

    if (!validPhone) {
        el.setState(prevState => {
            return {
                ...prevState,
                errors: {
                    ...prevState.errors,
                    phoneNumber: "Invalid phone number"
                }
            };
        });
    } else {
        const errorsArr = el.state.errors;
        delete errorsArr.phoneNumber;
        el.setState(prevState => {
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    phoneNumber: {
                        ...prevState.phoneNumber,
                        value: telephone,
                        valid: validPhone
                    }
                },
                errors: {
                    ...errorsArr
                }
            };
        });
    }
};

const _emailHandler = (input, el = this) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const email = input.toString().trim();
    const validEmail = re.test(email);
    if (!validEmail) {
        el.setState(prevState => {
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    email: {
                        ...prevState.email,
                        value: email,
                        valid: validEmail
                    }
                },
                errors: {
                    ...prevState.errors,
                    email: "Invalid email address"
                }
            };
        });
    } else {
        const errorsArr = el.state.errors;
        delete errorsArr.email;
        el.setState(prevState => {
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    email: {
                        ...prevState.email,
                        value: email,
                        valid: email
                    }
                },
                errors: {
                    ...errorsArr
                }
            };
        });
    }
};

const _passwordHandler = ({ confirmPassword, password }) => {
    const confirmPassVal =
        confirmPassword.length > 1 ? confirmPassword.trim() : "";
    const cpTestResult = _validPassword(confirmPassVal, password.trim());
    const passLengthResult = password.length > 7 ? true : false;

    return { cpTestResult, passLengthResult };
};

const _confirmPasswordHandler = ({ confirmPassword, password }) => {
    const validatePassword = password.length > 1 ? password.trim() : "";
    return _validPassword(validatePassword, confirmPassword.trim());
};

const _validPassword = (confirmer, password) => {
    if (confirmer === "" && password.length > 7) {
        return false;
    } else if (
        confirmer !== "" &&
        password === confirmer &&
        password.length > 7
    ) {
        return true;
    }
};

const _limitText = (string, length = 20) => {
    const stringLength = string.length;
    if (stringLength < length) {
        return string;
    } else {
        return string.substring(0, length) + "...";
    }
};

const _formatMoney = amount => (
    <NumberFormat
        value={amount}
        displayType={"text"}
        thousandSeparator={true}
        decimalScale={2}
        fixedDecimalScale={true}
        prefix={"₦"}
        renderText={value => value}
    />
);

const _formatNumber = amount => (
    <NumberFormat
        value={amount}
        displayType={"text"}
        thousandSeparator={true}
        renderText={value => value}
    />
);

export {
    _emailHandler,
    _phoneHandler,
    _passwordHandler,
    _confirmPasswordHandler,
    _digitsValidator,
    _limitText,
    capitalizer,
    stateMapper,
    _formatMoney,
    _formatNumber
};
