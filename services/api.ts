import Toast from "@/utils/toast";

export const API_URL = "http://localhost:8080";

export interface ApiResponse<T> {
    data: T
}

const ApiService = {
    async get(endpoint: string, options?: RequestInit, access_token?: string) {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = "/"
                throw new Error("Session expired. Login again!")
            }

            await this.error(response);
            throw new Error(`Failed to fetch data: ${response.status}`);
        }
        return response.json();
    },

    async post<T>(endpoint: string, data: T, access_token?: string) {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access_token}`
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = "/"
                throw new Error("Session expired. Login again!")
            }

            await this.error(response);
            throw new Error(`Failed to create resource: ${response.status}`);
        }
        return response.json();
    },

    async put<T>(endpoint: string, data: T, access_token?: string) {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access_token}`
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = "/"
                throw new Error("Session expired. Login again!")
            }

            await this.error(response);
            throw new Error(`Failed to update resource: ${response.status}`);
        }
        return response.json();
    },

    async patch<T>(endpoint: string, data: T, access_token?: string) {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${access_token}`
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = "/"
                throw new Error("Session expired. Login again!")
            }

            await this.error(response);
            throw new Error(`Failed to partially update resource: ${response.status}`);
        }
        return response.json();
    },

    async delete(endpoint: string, access_token?: string) {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${access_token}`
            },
        });
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = "/"
                throw new Error("Session expired. Login again!")
            }

            await this.error(response);
            throw new Error(`Failed to delete resource: ${response.status}`);
        }
        return;
    },

    async error(response: Response) {
        const errors = await response.json();

        Toast.error(JSON.stringify(errors));
    }
};

export default ApiService;