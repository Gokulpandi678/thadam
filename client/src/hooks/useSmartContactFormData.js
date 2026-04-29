import { useRef, useState } from "react"
import { getFieldNameByToken, mapTokensToFormFields } from "../lib/contactFormService";

export const useSmartContactFormData = () => {

    const [smartFormTokens, setSmartFormTokens] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const inputRef = useRef(null);

    const addToken = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const inputToken = inputRef.current.value;

            if (inputToken.includes(",")) {
                const tokenList = inputToken
                    .split(",")
                    .map(t => t.trim())
                    .filter(Boolean);
                tokenList.forEach(token => {
                    appendToken(token, getFieldNameByToken(token));
                });
            } else {
                appendToken(inputToken, getFieldNameByToken(inputToken));
            }

            inputRef.current.value = "";
        }
    };

    const appendToken = (value, field) => {
        if (value)
            setSmartFormTokens(prev => [...prev, { value, field }]); 
        else
            setErrorMsg("Type some contact details to add...");
    }

    const removeToken = (index) => {
        setSmartFormTokens(prev => prev.filter((_, i) => i !== index));
    }

    const getMappedFields = () => {
        return mapTokensToFormFields(smartFormTokens);
    }

    return {
        smartFormTokens,
        getMappedFields,
        addToken,
        removeToken,
        errorMsg,
        inputRef
    }
}