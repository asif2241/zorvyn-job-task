import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "./user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserZodSchema } from "./user.validation";

export const UserRoutes = Router();

UserRoutes.post("/register",
    //  validateRequest(createUserZodSchema),
    UserController.createUser)
UserRoutes.get("/all-users", checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN), UserController.getAllUsers)
UserRoutes.get("/me", checkAuth(...Object.values(UserRole)), UserController.getMe)
UserRoutes.get("/:id", UserController.getSingleUser)
UserRoutes.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(UserRole)), UserController.updateUser)

// Block and Unblock an user
UserRoutes.patch("/block/:id", checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), UserController.blockUser)
UserRoutes.patch("/unblock/:id", checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), UserController.unBlockUser)