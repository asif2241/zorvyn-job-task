"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialRecord = void 0;
const mongoose_1 = require("mongoose");
const financialRecord_interface_1 = require("./financialRecord.interface");
const financialRecordSchema = new mongoose_1.Schema({
    amount: {
        type: Number,
        required: true,
        min: [0, "Amount must be a positive number"],
    },
    type: {
        type: String,
        enum: Object.values(financialRecord_interface_1.TransactionType),
        required: true,
        index: true,
    },
    category: {
        type: String,
        enum: Object.values(financialRecord_interface_1.TransactionCategory),
        required: true,
        index: true,
    },
    notes: {
        type: String,
        maxlength: [500, "Notes must not exceed 500 characters"],
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
// filter out deleted records globally
financialRecordSchema.pre("find", function () {
    this.where({ isDeleted: false });
});
// financialRecordSchema.pre("findOne", function () {
//     this.where({ isDeleted: false });
// });
exports.FinancialRecord = (0, mongoose_1.model)("FinancialRecord", financialRecordSchema);
