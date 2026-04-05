// financialRecord.validation.ts
import { z } from "zod";
import { TransactionCategory, TransactionType } from "./financialRecord.interface";

export const createFinancialRecordZodSchema = z.object({
    amount: z.number().min(0, "Amount must be a positive number"),

    type: z.enum(Object.values(TransactionType) as [string, ...string[]], {
        error: "Invalid transaction type"
    }),

    category: z.enum(Object.values(TransactionCategory) as [string, ...string[]], {
        error: "Invalid category"
    }),
    notes: z.string()
        .max(500, "Notes must not exceed 500 characters")
        .optional(),
})


export const updateFinancialRecordZodSchema = z.object({
    amount: z.number().min(0, "Amount must be a positive number").optional(),

    type: z.enum(Object.values(TransactionType) as [string, ...string[]], {
        error: "Invalid transaction type"
    }).optional(),

    category: z.enum(Object.values(TransactionCategory) as [string, ...string[]], {
        error: "Invalid category"
    }).optional(),
    notes: z.string()
        .max(500, "Notes must not exceed 500 characters")
        .optional(),
}).optional()

