import path from "path";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

/* Route Imports */
import AuthRoutes from "./routes/auth.route";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use("/", AuthRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Started at ${PORT}`));

export const prismaClient = require("@prisma/client");
