/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import { setAuthCookie } from "../../utils/setAuthCookie";
import AppError from "../../helpers/AppError";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    const { accessToken, refreshToken, user } = loginInfo;

    const userTokens = {
        accessToken,
        refreshToken
    }

    setAuthCookie(res, userTokens);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken,
            user: user
        }
    })
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(400, "No Refresh Token Received from cookies!")
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string);

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "New Access Token Retrive Successfully",
        data: tokenInfo
    })

})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User Logged Out Successfully",
        data: null
    })
})

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user

    await AuthServices.changePassword(oldPassword, newPassword, decodedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Password changed successfully",
        data: null
    })
})


export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    changePassword,

}