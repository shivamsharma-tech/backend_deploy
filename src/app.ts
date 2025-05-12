import express from "express";
import helmet from "helmet";
import cors from "cors";
import { errorMiddleware } from "@/middlewares/error.js";
import morgan from "morgan";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import userRoute from "@/routes/user";
import blogRoute from "@/routes/blog";
import bookRoute from "@/routes/book";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: './.env' });

export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
const port = process.env.PORT || 3000;

export const prisma = new PrismaClient();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(path.join(__dirname, "uploads"));

// ✅ Helmet for security
// app.use(
//   helmet({
//     contentSecurityPolicy: envMode !== "DEVELOPMENT",
//     crossOriginEmbedderPolicy: envMode !== "DEVELOPMENT",
//   })
// );

// ✅ Middleware setup
app.use(express.json()); // Native JSON parsing
app.use(express.urlencoded({ extended: true })); // URL-encoded data parsing
app.use(cors({
  origin: "*",               // Allow all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  // allowedHeaders: "Content-Type, Authorization",
  credentials: true
}));app.use(morgan('dev')); // HTTP request logger

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set('view engine', 'pug');
app.set('views', './views');

// ✅ Basic Route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// ✅ API Routes
app.use("/api", userRoute);  // Changed to avoid overlapping
app.use("/api/blogs", blogRoute);
app.use("/api", bookRoute);

// ✅ 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

// ✅ Global Error Handling
app.use(errorMiddleware);

// ✅ Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${envMode} mode.deploy i`);
});
