const express = require("express");

module.exports = (app) => {
  const routes = {
    v1: {
      auth: require("../v1/auth"),
      users: require("../v1/users"),
      items: require("../v1/items"),
      categories: require("../v1/categories"),
      orders: require("../v1/orders"),
      carts: require("../v1/carts"),
      messages: require("../v1/messages"),
      upload: require("../v1/upload"),
      payments: require("../v1/payment"),
    },
  };

  app.use("/api/v1/auth", routes.v1.auth);
  app.use("/api/v1/users", routes.v1.users);
  app.use("/api/v1/items", routes.v1.items);
  app.use("/api/v1/categories", routes.v1.categories);
  app.use("/api/v1/orders", routes.v1.orders);
  app.use("/api/v1/carts", routes.v1.carts);
  app.use("/api/v1/messages", routes.v1.messages);
  app.use("/api/v1/upload", routes.v1.upload);
  app.use("/api/v1/payments", routes.v1.payments);

  app.get("/", (req, res) => {
    res.json({
      message: "First API Collection.",
    });
  });
};
