// financialRecord.interface.ts
import { Types } from "mongoose";

export enum TransactionType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE",
}

export enum TransactionCategory {
    SALARY = "SALARY",
    FREELANCE = "FREELANCE",
    INVESTMENT = "INVESTMENT",
    FOOD = "FOOD",
    TRANSPORT = "TRANSPORT",
    UTILITIES = "UTILITIES",
    HEALTHCARE = "HEALTHCARE",
    ENTERTAINMENT = "ENTERTAINMENT",
    EDUCATION = "EDUCATION",
    SHOPPING = "SHOPPING",
    OTHER = "OTHER",

}

export interface IFinancialRecord {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    notes?: string;
    isDeleted?: boolean;
}