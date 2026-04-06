"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFinancialRecordZodSchema = exports.createFinancialRecordZodSchema = void 0;
// financialRecord.validation.ts
const zod_1 = require("zod");
const financialRecord_interface_1 = require("./financialRecord.interface");
exports.createFinancialRecordZodSchema = zod_1.z.object({
    amount: zod_1.z.number().min(0, "Amount must be a positive number"),
    type: zod_1.z.enum(Object.values(financialRecord_interface_1.TransactionType), {
        error: "Invalid transaction type"
    }),
    category: zod_1.z.enum(Object.values(financialRecord_interface_1.TransactionCategory), {
        error: "Invalid category"
    }),
    notes: zod_1.z.string()
        .max(500, "Notes must not exceed 500 characters")
        .optional(),
});
exports.updateFinancialRecordZodSchema = zod_1.z.object({
    amount: zod_1.z.number().min(0, "Amount must be a positive number").optional(),
    type: zod_1.z.enum(Object.values(financialRecord_interface_1.TransactionType), {
        error: "Invalid transaction type"
    }).optional(),
    category: zod_1.z.enum(Object.values(financialRecord_interface_1.TransactionCategory), {
        error: "Invalid category"
    }).optional(),
    notes: zod_1.z.string()
        .max(500, "Notes must not exceed 500 characters")
        .optional(),
}).optional();
