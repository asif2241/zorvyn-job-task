import { Types } from "mongoose";

export enum UserRole {
    VIEWER = "VIEWER",
    ANALYST = "ANALYST",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    status?: UserStatus;
    isDeleted?: boolean;
    isBlocked?: boolean;
}