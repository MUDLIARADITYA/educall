
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import { Server } from "socket.io";

// // Routes
// import authRoutes from "../routes/auth.js";
// import questionRoutes from "../routes/question.js";
// import feedbackRoutes from "../routes/feedback.js";
// import teacherRoutes from "../routes/teacher.js";
// import zegoRoutes from "../routes/zego.js";
// import categoryRoutes from "../routes/category.js";
// import aiRoutes from "../routes/ai.js";

// /* ------------------ ENV SETUP ------------------ */
// dotenv.config();

// const app = express();

// /* ------------------ __dirname FIX (ES MODULE) ------------------ */
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// /* ------------------ MIDDLEWARES ------------------ */
// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );

// app.use(express.json());

// /* ------------------ API ROUTES (NO WILDCARDS HERE) ------------------ */
// app.use("/api/auth", authRoutes);
// app.use("/api/question", questionRoutes);
// app.use("/api/feedback", feedbackRoutes);
// app.use("/api/teachers", teacherRoutes);
// app.use("/api/zego", zegoRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/ai", aiRoutes);

// /* ------------------ DATABASE ------------------ */
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB error:", err));

// /* ------------------ FRONTEND SERVING (EXPRESS 5 SAFE) ------------------ */
// const frontendPath = path.join(__dirname, "../../frontend/dist");

// // Serve static files
// app.use(express.static(frontendPath));

// // ✅ EXPRESS 5 SAFE FALLBACK (NO app.get("*"))
// app.use((req, res) => {
//   res.sendFile(path.join(frontendPath, "index.html"));
// });

// /* ------------------ START SERVER ------------------ */
// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () =>
//   console.log(`🚀 Server running on port ${PORT}`)
// );

// /* ------------------ SOCKET.IO ------------------ */
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("🟢 User connected");

//   socket.on("new-question", (data) => {
//     io.emit("broadcast-question", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 User disconnected");
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

/* ------------------ ENV ------------------ */
dotenv.config();

const app = express();

/* ------------------ __dirname (ESM FIX) ------------------ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ------------------ CORS (FIXED) ------------------ */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://edu-connect-c2rq.onrender.com",
    ],
    credentials: true,
  })
);

// ✅ PRE-FLIGHT SUPPORT (VERY IMPORTANT)
app.options("*", cors());

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

/* ------------------ FRONTEND (EXPRESS 5 SAFE) ------------------ */
const frontendPath = path.join(__dirname, "../../frontend/dist");

// Serve static files
app.use(express.static(frontendPath));

// ✅ EXPRESS 5 + NODE 22 SAFE FALLBACK
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ------------------ START SERVER ------------------ */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* ------------------ SOCKET.IO ------------------ */
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://edu-connect-c2rq.onrender.com",
    ],
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
