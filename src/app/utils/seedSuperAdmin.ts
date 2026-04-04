import { envVars } from "../config/env";
import bcryptjs from "bcryptjs"
import { User } from "../modules/users/user.model";
import { IUser, UserRole } from "../modules/users/user.interface";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExists = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })

        if (isSuperAdminExists) {
            console.log("super admin already exists")
            return
        }

        console.log("Trying to create Super Admin....")

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))


        const payload: IUser = {
            name: "Super Admin",
            role: UserRole.SUPER_ADMIN,
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const superAdmin = await User.create(payload)
        console.log("Super Admin Created Successfully! \n");
        // console.log(superAdmin);

    } catch (error) {
        console.log(error);
    }
}