import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/main.routes.js";
import { port } from "./config.js";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router); //Middleware Para usar el router

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my API" });
});

// handling errors
app.use((err, req, res, next) => {
  return res.status(500).json({
    status: "error",
    message: err.message,
  });
});

app.listen(port);
console.log(`Server on Aport ${port}`);
