"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialRecordRoutes = void 0;
// financialRecord.route.ts
const express_1 = require("express");
const financialRecord_controller_1 = require("./financialRecord.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const financialRecord_validation_1 = require("./financialRecord.validation");
const user_interface_1 = require("../users/user.interface");
exports.FinancialRecordRoutes = (0, express_1.Router)();
exports.FinancialRecordRoutes.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.SUPER_ADMIN, user_interface_1.UserRole.ANALYST), (0, validateRequest_1.validateRequest)(financialRecord_validation_1.createFinancialRecordZodSchema), financialRecord_controller_1.FinancialRecordController.createRecord);
exports.FinancialRecordRoutes.get("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), financialRecord_controller_1.FinancialRecordController.getAllRecords);
exports.FinancialRecordRoutes.get("/:id", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), financialRecord_controller_1.FinancialRecordController.getSingleRecord);
exports.FinancialRecordRoutes.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.SUPER_ADMIN, user_interface_1.UserRole.ANALYST), (0, validateRequest_1.validateRequest)(financialRecord_validation_1.updateFinancialRecordZodSchema), financialRecord_controller_1.FinancialRecordController.updateRecord);
exports.FinancialRecordRoutes.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.SUPER_ADMIN), financialRecord_controller_1.FinancialRecordController.deleteRecord);
// Dashboard Summary
exports.FinancialRecordRoutes.get("/summary/overview", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), financialRecord_controller_1.FinancialRecordController.getOverviewSummary);
exports.FinancialRecordRoutes.get("/summary/by-category", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), financialRecord_controller_1.FinancialRecordController.getCategorySummary);
exports.FinancialRecordRoutes.get("/summary/trends", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), financialRecord_controller_1.FinancialRecordController.getTrends);
exports.FinancialRecordRoutes.get("/summary/recent", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.UserRole)), financialRecord_controller_1.FinancialRecordController.getRecentActivity);
