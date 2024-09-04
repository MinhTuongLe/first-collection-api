const express = require("express");
const connectDB = require("./config/db");
const setupMiddlewares = require("./middlewares/middlewares");
const setupRoutes = require("./routes/v1/routes");
const setupServer = require("./server");

const startServer = async () => {
  const app = express();

  await connectDB();
  setupMiddlewares(app);
  setupRoutes(app);
  setupServer(app);
};

startServer();
