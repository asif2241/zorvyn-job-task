"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters")
        .trim(),
    email: zod_1.z
        .email("Invalid email address")
        .trim()
        .toLowerCase(),
    password: zod_1.z.string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must not exceed 20 characters"),
    role: zod_1.z.enum(Object.values(user_interface_1.UserRole))
        .optional()
        .default(user_interface_1.UserRole.VIEWER),
    status: zod_1.z.enum(Object.values(user_interface_1.UserStatus))
        .optional()
        .default(user_interface_1.UserStatus.ACTIVE),
    isDeleted: zod_1.z.boolean().optional().default(false),
    isBlocked: zod_1.z.boolean().optional().default(false),
});
exports.updateUserZodSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters")
        .trim()
        .optional(),
    email: zod_1.z
        .email("Invalid email address")
        .trim()
        .toLowerCase()
        .optional(),
    password: zod_1.z.string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must not exceed 20 characters")
        .optional(),
    role: zod_1.z.enum(Object.values(user_interface_1.UserRole))
        .optional()
        .default(user_interface_1.UserRole.VIEWER)
        .optional(),
    status: zod_1.z.enum(Object.values(user_interface_1.UserStatus))
        .optional()
        .default(user_interface_1.UserStatus.ACTIVE)
        .optional(),
    isDeleted: zod_1.z.boolean().optional().default(false).optional(),
    isBlocked: zod_1.z.boolean().optional().default(false).optional(),
});
