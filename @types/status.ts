export const StatusEnum = {
    ACTIVE: "A",
    INACTIVE: "I",
    REMOVED: "R"
} as const;

export type StatusType = typeof StatusEnum[keyof typeof StatusEnum];