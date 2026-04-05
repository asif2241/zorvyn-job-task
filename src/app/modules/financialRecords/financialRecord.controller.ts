/* eslint-disable @typescript-eslint/no-unused-vars */
// financialRecord.controller.ts
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { FinancialRecordService } from "./financialRecord.service";
import { sendResponse } from "../../utils/sendResponse";
import StatusCodes from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const createRecord = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await FinancialRecordService.createRecord(req.body, decodedToken.userId);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Financial record created successfully",
        data: result
    });
});


const getAllRecords = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await FinancialRecordService.getAllRecords(query as Record<string, string>);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Financial records retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});

const getSingleRecord = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await FinancialRecordService.getSingleRecord(req.params.id as string);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Financial record retrieved successfully",
        data: result
    });
});

const updateRecord = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await FinancialRecordService.updateRecord(req.params.id as string, req.body, decodedToken);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Financial record updated successfully",
        data: result
    });
});

const deleteRecord = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await FinancialRecordService.deleteRecord(req.params.id as string, decodedToken);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Financial record deleted successfully",
        data: result
    });
});

const getOverviewSummary = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await FinancialRecordService.getOverviewSummary();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Overview summary retrieved successfully",
        data: result
    });
});

const getCategorySummary = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await FinancialRecordService.getCategorySummary();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Category summary retrieved successfully",
        data: result
    });
});

const getTrends = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await FinancialRecordService.getTrends(query as Record<string, string>);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Trends retrieved successfully",
        data: result
    });
});

const getRecentActivity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await FinancialRecordService.getRecentActivity(query as Record<string, string>);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Recent activity retrieved successfully",
        data: result
    });
});

export const FinancialRecordController = {
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