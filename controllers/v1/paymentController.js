const paymentService = require("../../services/paymentService");

exports.getAllPayments = async (req, res) => {
  try {
    const result = await paymentService.getAllPayments(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(
      res.payment._id.toString(),
      req.user
    );
    res.json(payment);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const result = await paymentService.createPayment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
