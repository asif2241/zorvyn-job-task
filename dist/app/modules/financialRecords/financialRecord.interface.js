"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionCategory = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["INCOME"] = "INCOME";
    TransactionType["EXPENSE"] = "EXPENSE";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionCategory;
(function (TransactionCategory) {
    TransactionCategory["SALARY"] = "SALARY";
    TransactionCategory["FREELANCE"] = "FREELANCE";
    TransactionCategory["INVESTMENT"] = "INVESTMENT";
    TransactionCategory["FOOD"] = "FOOD";
    TransactionCategory["TRANSPORT"] = "TRANSPORT";
    TransactionCategory["UTILITIES"] = "UTILITIES";
    TransactionCategory["HEALTHCARE"] = "HEALTHCARE";
    TransactionCategory["ENTERTAINMENT"] = "ENTERTAINMENT";
    TransactionCategory["EDUCATION"] = "EDUCATION";
    TransactionCategory["SHOPPING"] = "SHOPPING";
    TransactionCategory["OTHER"] = "OTHER";
})(TransactionCategory || (exports.TransactionCategory = TransactionCategory = {}));
