"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialRecordService = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
// financialRecord.service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../helpers/AppError"));
const financialRecord_interface_1 = require("./financialRecord.interface");
const financialRecord_model_1 = require("./financialRecord.model");
const mongoose_1 = require("mongoose");
const user_interface_1 = require("../users/user.interface");
// const createRecord = async (payload: Partial<IFinancialRecord>, userId: string) => {
//     const record = await FinancialRecord.create({ userId: userId, ...payload });
//     return record;
// };
const createRecord = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (payload.type === financialRecord_interface_1.TransactionType.EXPENSE) {
        const balanceResult = yield financialRecord_model_1.FinancialRecord.aggregate([
            { $match: { userId: new mongoose_1.Types.ObjectId(userId), isDeleted: false } },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);
        const totalIncome = ((_a = balanceResult.find(r => r._id === financialRecord_interface_1.TransactionType.INCOME)) === null || _a === void 0 ? void 0 : _a.total) || 0;
        const totalExpense = ((_b = balanceResult.find(r => r._id === financialRecord_interface_1.TransactionType.EXPENSE)) === null || _b === void 0 ? void 0 : _b.total) || 0;
        const netBalance = totalIncome - totalExpense;
        const expenseAmount = payload.amount || 0;
        if (expenseAmount > netBalance) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Insufficient balance. Your net balance is ${netBalance}, but you are trying to expense ${payload.amount}`);
        }
    }
    const record = yield financialRecord_model_1.FinancialRecord.create(Object.assign({ userId: userId }, payload));
    return record;
});
const getAllRecords = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {
        isDeleted: { $ne: true }
    };
    if (query.type)
        filter.type = query.type;
    if (query.category)
        filter.category = query.category;
    if (query.userId)
        filter.userId = query.userId;
    // date range filter
    if (query.startDate || query.endDate) {
        filter.date = {};
        if (query.startDate)
            filter.createdAt.$gte = new Date(query.startDate);
        if (query.endDate)
            filter.createdAt.$lte = new Date(query.endDate);
    }
    const records = yield financialRecord_model_1.FinancialRecord.find(filter)
        .sort("-createdAt")
        .skip(skip)
        .limit(limit);
    // .populate("userId", "name email");
    const total = yield financialRecord_model_1.FinancialRecord.countDocuments(filter);
    const totalPage = Math.ceil(total / limit);
    return {
        data: records,
        meta: { page, limit, totalPage, total }
    };
});
const getSingleRecord = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield financialRecord_model_1.FinancialRecord.findById(id).populate("userId", "name email");
    if (!record) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Financial record not found");
    }
    return record;
});
const updateRecord = (id, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield financialRecord_model_1.FinancialRecord.findById(id);
    if (!record) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Financial record not found");
    }
    //admin, super admin and analyst can update their own record
    if (record.userId !== decodedToken.userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized to update this record");
    }
    const updated = yield financialRecord_model_1.FinancialRecord.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
    return updated;
});
const deleteRecord = (id, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const record = yield financialRecord_model_1.FinancialRecord.findById(id);
    if (!record) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Financial record not found");
    }
    // console.log(record.userId);
    // console.log(decodedToken.userId);
    const isAdmin = decodedToken.role === user_interface_1.UserRole.ADMIN || decodedToken.role === user_interface_1.UserRole.SUPER_ADMIN;
    const isOwner = ((_a = record.userId) === null || _a === void 0 ? void 0 : _a.toString()) === decodedToken.userId;
    if (!isAdmin && !isOwner) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized to delete this record");
    }
    // soft delete
    record.isDeleted = true;
    yield record.save();
    return record;
});
const getOverviewSummary = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield financialRecord_model_1.FinancialRecord.aggregate([
        {
            $group: {
                _id: "$type",
                total: { $sum: "$amount" }
            }
        }
    ]);
    const totalIncome = ((_a = result.find(r => r._id === financialRecord_interface_1.TransactionType.INCOME)) === null || _a === void 0 ? void 0 : _a.total) || 0;
    const totalExpense = ((_b = result.find(r => r._id === financialRecord_interface_1.TransactionType.EXPENSE)) === null || _b === void 0 ? void 0 : _b.total) || 0;
    const netBalance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, netBalance };
});
const getCategorySummary = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield financialRecord_model_1.FinancialRecord.aggregate([
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
});
const getTrends = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const period = query.period || "monthly"; // daily | weekly | monthly
    let groupBy;
    if (period === "daily") {
        groupBy = {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
        };
    }
    else if (period === "weekly") {
        groupBy = {
            year: { $isoWeekYear: "$createdAt" },
            week: { $isoWeek: "$createdAt" }
        };
    }
    else {
        // default: monthly
        groupBy = {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
        };
    }
    const result = yield financialRecord_model_1.FinancialRecord.aggregate([
        { $match: { isDeleted: false } },
        {
            $group: {
                _id: Object.assign(Object.assign({}, groupBy), { type: "$type" }),
                total: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 } }
    ]);
    return result;
});
const getRecentActivity = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = Number(query.limit) || 10;
    const records = yield financialRecord_model_1.FinancialRecord.find()
        .sort("-createdAt")
        .limit(limit)
        .select("amount type category createdAt notes");
    return records;
});
exports.FinancialRecordService = {
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
