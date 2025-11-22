const URLS = {
    PRODUCT: {
        LIST: "product",
        POST: "product",
        STATUS: (product_info_id: number) => `product/status/${product_info_id}`,
        UPDATE: (product_id: number) => `product/${product_id}`
    },
    PROMOTION: {
        LIST: "promotion"
    },
    SALE: {
        POST: "sale",
        LIST: (page: number, limit: number) => `sale?page=${page}&limit=${limit}`,
        USER: {
            METRICS: "sale/user/metrics"
        }
    },
    BRANCH: {
        LIST: "branch"
    },
    USER: {
        CUSTOMER: {
            LIST: "user",
            POST: "user",
            STATUS: (user_id: number) => `user/status/${user_id}`,
            UPDATE: (user_id: number) => `user/${user_id}`
        },
        EMPLOYEE: {
            LIST: "user/employee"
        },
        MANAGER: {
            LIST: "user/employee?role=M"
        }
    },
    AUTH: {
        LOGIN: "auth/login",
        REFRESH: "auth/refresh"
    }
};

export default URLS;
