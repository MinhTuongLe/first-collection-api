// Payment status
const PaymentStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
};

// Payment methods
const PaymentMethod = {
  CREDIT_CARD: "credit_card",
  PAYPAL: "paypal",
  BANK_TRANSFER: "bank_transfer",
  COD: "cod",
};

module.exports = {
  PaymentStatus,
  PaymentMethod,
};
