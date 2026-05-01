import { backend_base_url } from "./apiClient";

export const authApi = {
    logout : () => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = `${backend_base_url}/auth/logout`;
        document.body.appendChild(form);
        form.submit();
    }
}
