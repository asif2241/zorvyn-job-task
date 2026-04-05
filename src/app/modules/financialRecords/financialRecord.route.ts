// financialRecord.route.ts
import { Router } from "express";
import { FinancialRecordController } from "./financialRecord.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createFinancialRecordZodSchema, updateFinancialRecordZodSchema } from "./financialRecord.validation";
import { UserRole } from "../users/user.interface";

export const FinancialRecordRoutes = Router();


FinancialRecordRoutes.post(
    "/",
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.ANALYST),
    validateRequest(createFinancialRecordZodSchema),
    FinancialRecordController.createRecord
);

FinancialRecordRoutes.get(
    "/",
    checkAuth(...Object.values(UserRole)),
    FinancialRecordController.getAllRecords
);

FinancialRecordRoutes.get(
    "/:id",
    checkAuth(...Object.values(UserRole)),
    FinancialRecordController.getSingleRecord
);

FinancialRecordRoutes.patch(
    "/:id",
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.ANALYST),
    validateRequest(updateFinancialRecordZodSchema),
    FinancialRecordController.updateRecord
);

FinancialRecordRoutes.delete(
    "/:id",
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    FinancialRecordController.deleteRecord
);

// Dashboard Summary
FinancialRecordRoutes.get(
    "/summary/overview",
    checkAuth(...Object.values(UserRole)),
    FinancialRecordController.getOverviewSummary
);

FinancialRecordRoutes.get(
    "/summary/by-category",
    checkAuth(UserRole.ANALYST, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    FinancialRecordController.getCategorySummary
);

FinancialRecordRoutes.get(
    "/summary/trends",
    checkAuth(UserRole.ANALYST, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    FinancialRecordController.getTrends
);

FinancialRecordRoutes.get(
    "/summary/recent",
    checkAuth(...Object.values(UserRole)),
    FinancialRecordController.getRecentActivity
);