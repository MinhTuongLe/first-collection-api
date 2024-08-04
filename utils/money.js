exports.formatMoney = (money) => {
  const formattedValue = new Intl.NumberFormat("en-VN", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(money);

  return `${formattedValue.replaceAll(",", ".")} VND`;
};
