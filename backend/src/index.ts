// Configures the Express app, routes, middleware, and error handling
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http, { Server } from "http";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import pianoRoutes from "./routes/pianoRoutes";
import pool from "./database";
import errorHandler from "./middleware/errorHandler";

dotenv.config({ path: "./config.env" });
const app: Application = express();
const server: Server = http.createServer(app);

const port: string = process.env.PORT!;
const frontendPort: string = process.env.FRONTEND_PORT!;
const protocol: string = process.env.PROTOCOL!;

// Parses incoming JSON requests
app.use(express.json());
// Enables CORS
app.use(
  cors({ origin: `${protocol}://localhost:${frontendPort}`, credentials: true })
);
// Makes cookies easily accessible
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/piano", pianoRoutes);

// Global Error Handler
app.use(errorHandler);

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database", err.stack);
  } else {
    console.log(
      "Database connection successful. Server time is:",
      res.rows[0].now
    );
  }
});

server.listen(port, () => {
  console.log(`The server is running on ${protocol}://localhost:${port}`);
});
