require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const helmet = require("helmet");
const cors = require("cors");
const { versioningMiddleware } = require("./middleware/versioning");
const socketHandler = require("./socket");

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(versioningMiddleware);

// Dynamic routes
const routes = {
  v1: {
    auth: require("./routes/v1/auth"),
    users: require("./routes/v1/users"),
    items: require("./routes/v1/items"),
    categories: require("./routes/v1/categories"),
    orders: require("./routes/v1/orders"),
    carts: require("./routes/v1/carts"),
    messages: require("./routes/v1/messages"),
  },
};

app.get("/api", (req, res) => {
  res.json({
    message: "First API Collection.",
  });
});
app.use("/api/v1/auth", routes.v1.auth);
app.use("/api/v1/users", routes.v1.users);
app.use("/api/v1/items", routes.v1.items);
app.use("/api/v1/categories", routes.v1.categories);
app.use("/api/v1/orders", routes.v1.orders);
app.use("/api/v1/carts", routes.v1.carts);
app.use("/api/v1/messages", routes.v1.messages);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
socketHandler(server);
