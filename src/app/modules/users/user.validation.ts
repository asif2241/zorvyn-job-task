import { z } from "zod";
import { UserRole, UserStatus } from "./user.interface";

export const createUserZodSchema = z.object({

    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters")
        .trim(),

    email: z
        .email("Invalid email address")
        .trim()
        .toLowerCase(),

    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must not exceed 20 characters"),

    role: z.enum(Object.values(UserRole) as [string, ...string[]])
        .optional()
        .default(UserRole.VIEWER),

    status: z.enum(Object.values(UserStatus) as [string, ...string[]])
        .optional()
        .default(UserStatus.ACTIVE),

    isDeleted: z.boolean().optional().default(false),
    isBlocked: z.boolean().optional().default(false),
})



export const updateUserZodSchema = z.object({

    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters")
        .trim()
        .optional(),
    email: z
        .email("Invalid email address")
        .trim()
        .toLowerCase()
        .optional(),

    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must not exceed 20 characters")
        .optional(),

    role: z.enum(Object.values(UserRole) as [string, ...string[]])
        .optional()
        .default(UserRole.VIEWER)
        .optional(),

    status: z.enum(Object.values(UserStatus) as [string, ...string[]])
        .optional()
        .default(UserStatus.ACTIVE)
        .optional(),

    isDeleted: z.boolean().optional().default(false).optional(),
    isBlocked: z.boolean().optional().default(false).optional(),

});
