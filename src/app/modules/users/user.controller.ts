/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import StatusCodes from "http-status-codes"
import { JwtPayload } from "jsonwebtoken";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "User created successfully",
        data: user
    })
})

//get all user
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await UserServices.getAllUsers(query as Record<string, string>);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "All Users Retrived Successfully",
        data: result.data,
        meta: result.meta
    })
})

const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUser(id as string);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "User retrieved successfully",
        data: result.data
    })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const verifiedToken = req.user;

    const user = await UserServices.updateUser(userId as string, payload, verifiedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "User updated successfully",
        data: user
    })
})


const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    const result = await UserServices.getMe(decodedToken as JwtPayload)
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "User Retrieve Successfully",
        data: result.data
    })
})

const blockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    // console.log(id);
    const decodedToken = req.user;

    const result = await UserServices.blockUser(id as string);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User Blocked Successfully",
        data: result
    })
})

const unBlockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    // console.log(id);
    const result = await UserServices.unBlockUser(id as string);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User Unblocked Successfully",
        data: result
    })
})

export const UserController = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    blockUser,
    unBlockUser,
    getMe
}