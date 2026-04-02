import { Router } from "express";
import { UserRoutes } from "../modules/users/users.routes";

export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    }
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})