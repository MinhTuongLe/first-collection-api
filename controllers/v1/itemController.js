const itemService = require("../../services/itemService");

exports.getAllItems = async (req, res) => {
  const { page = 1, limit = 10, search = "", category = "" } = req.query;

  try {
    const result = await itemService.getAllItems(page, limit, search, category);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const newItem = await itemService.createItem(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await itemService.updateItem(req.params.id, req.body);
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateItemStatus = async (req, res) => {
  try {
    const updatedItem = await itemService.updateItemStatus(
      req.params.id,
      req.body.status
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await itemService.deleteItem(req.params.id);
    res.json({ message: "Deleted Item" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
