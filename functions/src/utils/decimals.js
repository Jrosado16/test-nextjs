const reduceDecimals = (value = 0) => {
  const amount = value || 0;
  const aux = amount.toString().split(".");
  let isExp;
  if (aux[1]?.includes("e")) isExp = true;
  let decimalPart = "";
  if (value < 0.0000001) return 0;
  decimalPart = aux[1] ? ".".concat(aux[1].substring(0, 6)) : "";
  return isExp || !amount? 0: Number(`${aux[0]}${decimalPart}`);
};

module.exports = {
  reduceDecimals,
};
