export const getFieldNameByToken = (token) => {
    const emailRegex = /^[\w.+%-]+@[\w.-]+\.[a-z]{2,}$/i;
    const phoneRegex = /^\+?[\d][\d\s\-().]{6,19}$/;
    const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i;

    const trimmedToken = token.trim();

    if(emailRegex.test(trimmedToken))
        return "email";
    else if(phoneRegex.test(trimmedToken))
        return "phone";
    else if(linkedinRegex.test(trimmedToken))
        return "linkedin";
    else 
        return "name";
}

export const mapTokensToFormFields = (tokens) => {
    const result = {};
    let emailCount = 0;
    let phoneCount = 0;

    tokens.forEach(({ value, field }) => {
        switch (field) {
            case "email":
                if (emailCount === 0) result.primaryEmail = value;
                else if (emailCount === 1) result.secondaryEmail = value;
                emailCount++;
                break;

            case "phone":
                if (phoneCount === 0) result.primaryContactNo = value;
                else if (phoneCount === 1) result.secondaryContactNo = value;
                phoneCount++;
                break;

            case "linkedin":
                result.socialLinkedin = value;
                break;

            case "name": {
                const parts = value.trim().split(/\s+/);
                result.firstName = parts.slice(0, -1).join(" ") || parts[0];
                result.lastName = parts.length > 1 ? parts[parts.length - 1] : "";
                break;
            }

            default:
                break;
        }
    });

    return result;
};