
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

// Routes
import authRoutes from "../routes/auth.js";
import questionRoutes from "../routes/question.js";
import feedbackRoutes from "../routes/feedback.js";
import teacherRoutes from "../routes/teacher.js";
import zegoRoutes from "../routes/zego.js";
import categoryRoutes from "../routes/category.js";
import aiRoutes from "../routes/ai.js";

/* ------------------ ENV ------------------ */
dotenv.config();

const app = express();

/* ------------------ CORS (FINAL & CORRECT) ------------------ */
const allowedOrigins = [
  "http://localhost:5173",
  "https://educall.onrender.com",
  "https://edu-connect-c2rq.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ EXPRESS 5 SAFE PREFLIGHT HANDLER
app.options(/.*/, cors());

/* ------------------ MIDDLEWARES ------------------ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------ API ROUTES ------------------ */
app.use("/api/auth", authRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/zego", zegoRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/ai", aiRoutes);

/* ------------------ DATABASE ------------------ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ------------------ START SERVER ------------------ */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* ------------------ SOCKET.IO ------------------ */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("new-question", (data) => {
    io.emit("broadcast-question", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});
