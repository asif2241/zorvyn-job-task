"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const users_routes_1 = require("../modules/users/users.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const financialRecord_route_1 = require("../modules/financialRecords/financialRecord.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: users_routes_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/records",
        route: financialRecord_route_1.FinancialRecordRoutes
    }
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
