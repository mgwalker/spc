const products = [
  {
    name: "thunderstorm",
    key: "cat",
  },
  {
    name: "tornado",
    key: "torn",
  },
  {
    name: "hail",
    key: "hail",
  },
  {
    name: "wind",
    key: "wind",
  },
];

const stormLabelMappings = new Map([
  ["TSTM", "general risk"],
  ["MRGL", "marginal risk"],
  ["SLGT", "slight risk"],
  ["ENH", "enhanced risk"],
  ["MDT", "moderate risk"],
  ["HIGH", "high risk"],
]);

const tornadoLabelMappings = new Map([
  ["0.02", "2% risk"],
  ["0.05", "5% risk"],
  ["0.10", "10% risk"],
  ["0.15", "15% risk"],
  ["0.30", "30% risk"],
  ["0.45", "45% risk"],
  ["0.60", "60% risk"],
  ["SIGN", "significant"],
]);

const windLabelMappings = new Map([
  ["0.05", "5% risk"],
  ["0.15", "15% risk"],
  ["0.30", "30% risk"],
  ["0.45", "45% risk"],
  ["0.60", "60% risk"],
  ["SIGN", "significant"],
]);

const labelMappings = new Map([
  ["cat", stormLabelMappings],
  ["torn", tornadoLabelMappings],
  ["wind", windLabelMappings],
  ["hail", windLabelMappings],
]);

export const days = [[...products], [...products], [products[0]]];

export const getRisk = (productKey, label) =>
  labelMappings.get(productKey)?.get(label);
