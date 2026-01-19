
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { Server } from 'socket.io';


// import authRoutes from '../routes/auth.js';
// import questionRoutes from '../routes/question.js';
// import feedbackRoutes from '../routes/feedback.js';
// import teacherRoutes from '../routes/teacher.js';
// import zegoRoutes from '../routes/zego.js';
// import categoryRoutes from '../routes/category.js';
// import aiRoutes from '../routes/ai.js';

// // Initialize
// const app = express();
// dotenv.config();

// // Middlewares
// // app.use(cors());
// app.use(cors({
//   origin: ['https://edu-connect-c2rq.onrender.com', 'http://localhost:5173'],
//   credentials: true
// }));
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/question", questionRoutes);
// app.use("/api/feedback", feedbackRoutes);
// app.use("/api/teachers", teacherRoutes);
// app.use("/api/zego", zegoRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/ai", aiRoutes);

// // MongoDB
// mongoose
//   .connect(process.env.MONGO_URI,{
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Start server
// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// // Socket.io
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });

// io.on('connection', (socket) => {
//   console.log('🟢 A user connected');

//   socket.on('new-question', (data) => {
//     io.emit('broadcast-question', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('🔴 A user disconnected');
//   });
// });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

// Routes
import authRoutes from "../routes/auth.js";
import questionRoutes from "../routes/question.js";
import feedbackRoutes from "../routes/feedback.js";
import teacherRoutes from "../routes/teacher.js";
import zegoRoutes from "../routes/zego.js";
import categoryRoutes from "../routes/category.js";
import aiRoutes from "../routes/ai.js";

dotenv.config();

const app = express();

/* ------------------ FIX __dirname FOR ES MODULE ------------------ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ------------------ MIDDLEWARES ------------------ */
app.use(
  cors({
    origin: "*", // frontend & backend same domain
    credentials: true,
  })
);

app.use(express.json());

/* ------------------ API ROUTES (FIRST) ------------------ */
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

/* ------------------ FRONTEND STATIC SERVE ------------------ */
// Path to frontend build
const frontendPath = path.join(__dirname, "../../frontend/dist");

app.use(express.static(frontendPath));

// React Router support
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ------------------ START SERVER ------------------ */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

/* ------------------ SOCKET.IO ------------------ */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected");

  socket.on("new-question", (data) => {
    io.emit("broadcast-question", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected");
  });
});
