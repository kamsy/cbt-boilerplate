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

export const secureCardNumber = text => {
    // code to display the phone number like this 090******123
    const sliced = text.slice(3, text.length - 3);
    return text.replace(sliced, "*".repeat(sliced.length));
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

const _currencyToInteger = amt =>
    Number(
        amt
            .split(",")
            .join("")
            .split("₦")
            .join("")
    ) * 100;

export {
    _limitText,
    capitalizer,
    _formatMoney,
    _formatNumber,
    _currencyToInteger
};
