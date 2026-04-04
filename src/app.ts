import cookieParser from "cookie-parser"
import express, { Request, Response, urlencoded } from "express"
import cors from "cors"

import { globalErrorHandler } from "./app/middlewares/globalErrorHandler"
import notFound from "./app/middlewares/notFound"
import { router } from "./app/routes"

const app = express()


app.use(cookieParser())
app.use(express.json())
app.set("trust proxy", 1);
app.use(urlencoded({ extended: true }))
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))



app.use("/api/v1", router)
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome Zorvyn's Financial Data Management System Backend😊"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app