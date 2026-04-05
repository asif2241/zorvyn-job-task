import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { AuthControllers } from "./auth.controller";
import { UserRole } from "../users/user.interface";

export const AuthRoutes = Router();

AuthRoutes.post("/login", AuthControllers.credentialsLogin);
AuthRoutes.post("/refresh-token", AuthControllers.getNewAccessToken);
AuthRoutes.post("/logout", AuthControllers.logout);
AuthRoutes.post("/change-password", checkAuth(...Object.values(UserRole)), AuthControllers.changePassword);
