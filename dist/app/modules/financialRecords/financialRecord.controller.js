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
exports.FinancialRecordController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const financialRecord_service_1 = require("./financialRecord.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createRecord = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield financialRecord_service_1.FinancialRecordService.createRecord(req.body, decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Financial record created successfully",
        data: result
    });
}));
const getAllRecords = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield financialRecord_service_1.FinancialRecordService.getAllRecords(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Financial records retrieved successfully",
        data: result.data,
        meta: result.meta
    });
}));
const getSingleRecord = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield financialRecord_service_1.FinancialRecordService.getSingleRecord(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Financial record retrieved successfully",
        data: result
    });
}));
const updateRecord = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield financialRecord_service_1.FinancialRecordService.updateRecord(req.params.id, req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Financial record updated successfully",
        data: result
    });
}));
const deleteRecord = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield financialRecord_service_1.FinancialRecordService.deleteRecord(req.params.id, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Financial record deleted successfully",
        data: result
    });
}));
const getOverviewSummary = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield financialRecord_service_1.FinancialRecordService.getOverviewSummary();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Overview summary retrieved successfully",
        data: result
    });
}));
const getCategorySummary = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield financialRecord_service_1.FinancialRecordService.getCategorySummary();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Category summary retrieved successfully",
        data: result
    });
}));
const getTrends = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield financialRecord_service_1.FinancialRecordService.getTrends(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Trends retrieved successfully",
        data: result
    });
}));
const getRecentActivity = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield financialRecord_service_1.FinancialRecordService.getRecentActivity(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Recent activity retrieved successfully",
        data: result
    });
}));
exports.FinancialRecordController = {
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
