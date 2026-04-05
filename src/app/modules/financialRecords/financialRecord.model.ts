import { model, Schema } from "mongoose";
import { IFinancialRecord, TransactionCategory, TransactionType } from "./financialRecord.interface";

const financialRecordSchema = new Schema<IFinancialRecord>(
    {

        amount: {
            type: Number,
            required: true,
            min: [0, "Amount must be a positive number"],
        },
        type: {
            type: String,
            enum: Object.values(TransactionType),
            required: true,
        },
        category: {
            type: String,
            enum: Object.values(TransactionCategory),
            required: true,
        },

        notes: {
            type: String,
            maxlength: [500, "Notes must not exceed 500 characters"],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// filter out deleted records globally
// financialRecordSchema.pre("find", function () {
//     this.where({ isDeleted: false });
// });

// financialRecordSchema.pre("findOne", function () {
//     this.where({ isDeleted: false });
// });

export const FinancialRecord = model<IFinancialRecord>("FinancialRecord", financialRecordSchema)
