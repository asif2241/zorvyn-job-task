/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../helpers/AppError";
import { userSortField } from "./user.constant";
import { IUser, UserRole } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"
import StatusCodes from "http-status-codes"

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExists = await User.findOne({ email })

    if (isUserExists) {
        throw new AppError(StatusCodes.FORBIDDEN, "User already exists!!")
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))


    const user = await User.create({
        email,
        password: hashedPassword,
        ...rest
    })

    return user
}

//get all user
const getAllUsers = async (query: Record<string, string>) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const userRole = query.role;
    const searchEmail = query.searchEmail;

    const userInputSort = query.sort || "-createdAt";
    const sortField = userInputSort.startsWith('-') ? userInputSort.substring(1) : userInputSort;
    let sort = "-createdAt";
    if (userSortField.includes(sortField)) {
        sort = userInputSort;
    }

    const filter: Record<string, any> = {};

    if (userRole) {
        filter.role = userRole
    }
    if (searchEmail) {
        filter.email = searchEmail
    }


    const users = await User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("-password");

    const totalUsers = await User.countDocuments(filter);
    const totalPage = Math.ceil(totalUsers / limit)


    const meta = {
        page,
        limit,
        totalPage,
        total: totalUsers
    }

    return {
        data: users,
        meta: meta
    }

}
//get single user
const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return {
        data: user
    }
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    if (decodedToken.role === UserRole.VIEWER || decodedToken.role === UserRole.ANALYST) {
        if (userId !== decodedToken.userId) {
            throw new AppError(StatusCodes.FORBIDDEN, "You can only update your own profile")
        }
    }

    const isUserExists = await User.findById(userId);

    if (!isUserExists) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found")
    }

    if (decodedToken.role === UserRole.ADMIN && isUserExists.role === UserRole.SUPER_ADMIN) {
        throw new AppError(StatusCodes.FORBIDDEN, "An Admin Cannot Update  Super Admin")
    }

    if (payload.role) {
        if (decodedToken.role === UserRole.VIEWER || decodedToken.role === UserRole.ANALYST) {
            throw new AppError(StatusCodes.FORBIDDEN, "You cannot update your role")
        }

        if (payload.role === UserRole.SUPER_ADMIN && decodedToken.role === UserRole.ADMIN) {
            throw new AppError(401, "Only Super Admin Can Create an Admin")
        }
    }

    if (payload.status || payload.isDeleted) {
        if (decodedToken.role === UserRole.VIEWER || decodedToken.role === UserRole.ANALYST) {
            throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to update this field!")
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true, runValidators: true
    })

    return newUpdatedUser
}

const getMe = async (decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId).select("-password");
    return {
        data: user
    }
}


const blockUser = async (id: string) => {
    const user = await User.findById(id).select("-password");

    if (!user) {
        throw new AppError(404, "User not found!")
    }

    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
        throw new AppError(StatusCodes.FORBIDDEN, "Cannot Block  Admin Users")
    }

    if (user.isBlocked) {
        throw new AppError(StatusCodes.NOT_FOUND, "User is Already Blocked!")
    }

    user.isBlocked = true;

    await user.save();

    return user

}

const unBlockUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    if (!user) {
        throw new AppError(404, "User not found!")
    }

    if (!user.isBlocked) {
        throw new AppError(404, "User is Already Unblocked")
    }

    user.isBlocked = false;

    await user.save();

    return user

}

export const UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getMe,
    blockUser,
    unBlockUser
}