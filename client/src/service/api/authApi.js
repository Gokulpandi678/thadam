
export const authApi = {
    logout : () => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "http://localhost:5000/api/v1/auth/logout";
        document.body.appendChild(form);
        form.submit();
    }
}