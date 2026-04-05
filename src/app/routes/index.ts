import { Router } from "express";
import { UserRoutes } from "../modules/users/users.routes";
import { AuthRoutes } from "../modules/auth/auth.route";
import { FinancialRecordRoutes } from "../modules/financialRecords/financialRecord.route";

export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/records",
        route: FinancialRecordRoutes
    }
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})