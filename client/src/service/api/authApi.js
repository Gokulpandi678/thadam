
export const authApi = {
    logout : () => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/logout`;
        document.body.appendChild(form);
        form.submit();
    }
}
