import { model, Schema } from "mongoose";
import { IUser, UserRole, UserStatus } from "./user.interface";

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.VIEWER
    },
    status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.ACTIVE
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isBlocked: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
})

export const User = model<IUser>("User", userSchema)