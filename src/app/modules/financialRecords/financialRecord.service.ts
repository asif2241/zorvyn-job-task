/* eslint-disable @typescript-eslint/no-non-null-assertion */
// financialRecord.service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import StatusCodes from "http-status-codes";
import AppError from "../../helpers/AppError";
import { IFinancialRecord, TransactionType } from "./financialRecord.interface";
import { FinancialRecord } from "./financialRecord.model";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { UserRole } from "../users/user.interface";

// const createRecord = async (payload: Partial<IFinancialRecord>, userId: string) => {

//     const record = await FinancialRecord.create({ userId: userId, ...payload });
//     return record;
// };

const createRecord = async (payload: Partial<IFinancialRecord>, userId: string) => {
    if (payload.type === TransactionType.EXPENSE) {
        const balanceResult = await FinancialRecord.aggregate([
            { $match: { userId: new Types.ObjectId(userId), isDeleted: false } },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const totalIncome = balanceResult.find(r => r._id === TransactionType.INCOME)?.total || 0;
        const totalExpense = balanceResult.find(r => r._id === TransactionType.EXPENSE)?.total || 0;
        const netBalance = totalIncome - totalExpense;

        const expenseAmount = payload.amount || 0;
        if (expenseAmount > netBalance) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                `Insufficient balance. Your net balance is ${netBalance}, but you are trying to expense ${payload.amount}`
            );
        }
    }

    const record = await FinancialRecord.create({ userId: userId, ...payload });
    return record;
};

const getAllRecords = async (query: Record<string, string>) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
        isDeleted: { $ne: true }
    };

    if (query.type) filter.type = query.type;
    if (query.category) filter.category = query.category;
    if (query.userId) filter.userId = query.userId;

    // date range filter
    if (query.startDate || query.endDate) {
        filter.date = {};
        if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
        if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
    }

    const records = await FinancialRecord.find(filter)
        .sort("-createdAt")
        .skip(skip)
        .limit(limit)
    // .populate("userId", "name email");

    const total = await FinancialRecord.countDocuments(filter);
    const totalPage = Math.ceil(total / limit);

    return {
        data: records,
        meta: { page, limit, totalPage, total }
    };
};

const getSingleRecord = async (id: string) => {
    const record = await FinancialRecord.findById(id).populate("userId", "name email");

    if (!record) {
        throw new AppError(StatusCodes.NOT_FOUND, "Financial record not found");
    }
    return record;
};

const updateRecord = async (id: string, payload: Partial<IFinancialRecord>, decodedToken: JwtPayload) => {
    const record = await FinancialRecord.findById(id);

    if (!record) {
        throw new AppError(StatusCodes.NOT_FOUND, "Financial record not found");
    }

    //admin, super admin and analyst can update their own record
    if (record.userId !== decodedToken.userId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized to update this record")
    }

    const updated = await FinancialRecord.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });

    return updated;
};

const deleteRecord = async (id: string, decodedToken: JwtPayload) => {
    const record = await FinancialRecord.findById(id);

    if (!record) {
        throw new AppError(StatusCodes.NOT_FOUND, "Financial record not found");
    }

    // console.log(record.userId);
    // console.log(decodedToken.userId);

    const isAdmin = decodedToken.role === UserRole.ADMIN || decodedToken.role === UserRole.SUPER_ADMIN;
    const isOwner = record.userId?.toString() === decodedToken.userId;

    if (!isAdmin && !isOwner) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized to delete this record");
    }


    // soft delete
    record.isDeleted = true;
    await record.save();

    return record;
};

const getOverviewSummary = async () => {
    const result = await FinancialRecord.aggregate([
        {
            $group: {
                _id: "$type",
                total: { $sum: "$amount" }
            }
        }
    ]);


    const totalIncome = result.find(r => r._id === TransactionType.INCOME)?.total || 0;
    const totalExpense = result.find(r => r._id === TransactionType.EXPENSE)?.total || 0;
    const netBalance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, netBalance };
};

const getCategorySummary = async () => {
    const result = await FinancialRecord.aggregate([
        {
            $group: {
                _id: { type: "$type", category: "$category" },
                total: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        },
        { $sort: { total: -1 } }
    ]);

    return result;
};

const getTrends = async (query: Record<string, string>) => {
    const period = query.period || "monthly"; // daily | weekly | monthly

    let groupBy: Record<string, any>;

    if (period === "daily") {
        groupBy = {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
        };
    } else if (period === "weekly") {
        groupBy = {
            year: { $isoWeekYear: "$createdAt" },
            week: { $isoWeek: "$createdAt" }
        };
    } else {
        // default: monthly
        groupBy = {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
        };
    }

    const result = await FinancialRecord.aggregate([
        { $match: { isDeleted: false } },
        {
            $group: {
                _id: { ...groupBy, type: "$type" },
                total: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 } }
    ]);

    return result;
};

const getRecentActivity = async (query: Record<string, string>) => {
    const limit = Number(query.limit) || 10;
    const records = await FinancialRecord.find()
        .sort("-createdAt")
        .limit(limit)
        .select("amount type category createdAt notes")


    return records;
};

export const FinancialRecordService = {
    createRecord,
    getAllRecords,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    getOverviewSummary,
    getCategorySummary,
    getTrends,
    getRecentActivity
};