import { useEffect, useState } from "react";

const prefix = "dsc-";


export const useLocalStorage = (key, initialValue) => {
    const prefixedKey = prefix + key;

    const [value, setValue] = useState(() => {
        const jsonValue = localStorage.getItem(prefixedKey);
        if (jsonValue != null) return JSON.parse(jsonValue);
        if (typeof initialValue === "function") {
            return initialValue();
        } else {
            console.log(initialValue)
            return initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(prefixedKey, JSON.stringify(value));
    }, [prefixedKey, value]);

    return [value, setValue];
};
