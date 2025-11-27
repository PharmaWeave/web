const URLS = {
    PRODUCT: {
        LIST: "product",
        POST: "product",
        STATUS: (product_info_id: number) => `product/status/${product_info_id}`,
        UPDATE: (product_id: number) => `product/${product_id}`
    },
    PROMOTION: {
        LIST: "promotion",
        POST: "promotion",
        DELETE: (promotion_id: number) => `promotion/${promotion_id}`,
        FINALIZE: (promotion_id: number) => `promotion/${promotion_id}/finalize`,
    },
    SALE: {
        POST: "sale",
        LIST: (page: number, limit: number) => `sale?page=${page}&limit=${limit}`,
        USER: {
            METRICS: "sale/user/metrics"
        }
    },
    BRANCH: {
        LIST: "branch",
        POST: "branch",
        STATUS: (branch_id: number) => `branch/status/${branch_id}`,
        UPDATE: (branch_id: number) => `branch/${branch_id}`
    },
    USER: {
        CUSTOMER: {
            LIST: "user",
            POST: "user",
            STATUS: (user_id: number) => `user/status/${user_id}`,
            UPDATE: (user_id: number) => `user/${user_id}`
        },
        EMPLOYEE: {
            LIST: "user/employee",
            POST: "user/employee",
            STATUS: (employee_id: number) => `user/employee/status/${employee_id}`,
            UPDATE: (employee_id: number) => `user/employee/${employee_id}`,
            PROMOTE: (employee_id: number) => `user/employee/promote/${employee_id}`,
            DEMOTE: (employee_id: number) => `user/employee/demote/${employee_id}`,
            ACTIVATE: (token?: string | null) => `user/employee/activate?token=${token}`
        },
        MANAGER: {
            LIST: "user/employee?role=M"
        }
    },
    AUTH: {
        LOGIN: "auth/login",
        LOGOUT: "auth/logout",
        REFRESH: "auth/refresh"
    },
    METRICS: {
        RETRIEVE: "metrics"
    }
};

export default URLS;
