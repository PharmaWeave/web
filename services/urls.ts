const URLS = {
    PRODUCT: {
        LIST: "product"
    },
    PROMOTION: {
        LIST: "promotion"
    },
    SALE: {
        LIST: (page: number, limit: number) => `sale?page=${page}&limit=${limit}`,
        USER: {
            METRICS: "sale/user/metrics"
        }
    },
    USER: {
        CUSTOMER: {
            LIST: "user"
        },
        EMPLOYEE: {
            LIST: "user/employee"
        }
    },
    AUTH: {
        LOGIN: "auth/login",
        REFRESH: "auth/refresh"
    }
};

export default URLS;
