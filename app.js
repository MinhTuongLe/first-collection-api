require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const itemsRouter = require("./routes/items");
const categoriesRouter = require("./routes/categories");
const ordersRouter = require("./routes/orders");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/items", itemsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
