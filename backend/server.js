import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());    // enable JSON support so that it can read JSON requests

app.use("/api/menuParts", menuParts);

app.listen(5000, () => {
    connectDB();
    console.log("Server started on port:", PORT);
});



