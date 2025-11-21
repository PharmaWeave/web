export const RoleEnum = {
    ADMIN: "A",
    MANAGER: "M",
    EMPLOYEE: "E",
    USER: "U"
} as const;

export type RoleType = typeof RoleEnum[keyof typeof RoleEnum];