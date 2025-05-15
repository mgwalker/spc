const fillOpacity = 0.3;
const thunderstormStyles = new Map([
  ["general risk", { color: "#C0E8C0", fillOpacity }],
  ["marginal risk", { color: "#7FC57F", fillOpacity }],
  ["slight risk", { color: "#F6F67F", fillOpacity }],
  ["enhanced risk", { color: "#E6C27F", fillOpacity }],
  ["moderate risk", { color: "#E67F7F", fillOpacity }],
  ["high risk", { color: "#FF7FFF", fillOpacity }],
]);

const tornadoStyles = new Map([
  ["2% risk", { color: "#008B00", fillOpacity }],
  ["5% risk", { color: "#8B4726", fillOpacity }],
  ["10% risk", { color: "#FFC800", fillOpacity }],
  ["15% risk", { color: "#FF0000", fillOpacity }],
  ["30% risk", { color: "#FF00FF", fillOpacity }],
  ["45% risk", { color: "#912CEE", fillOpacity }],
  ["60% risk", { color: "#104E8B", fillOpacity }],
  ["significant", { color: "black", fillOpacity }],
]);

const windStyles = new Map([
  ["5% risk", { color: "#8B4726", fillOpacity }],
  ["15% risk", { color: "#FFC800", fillOpacity }],
  ["30% risk", { color: "#FF0000", fillOpacity }],
  ["45% risk", { color: "#FF00FF", fillOpacity }],
  ["60% risk", { color: "#912CEE", fillOpacity }],
  ["", { color: "black", fillOpacity }],
]);

const styles = new Map([
  ["thunderstorm", thunderstormStyles],
  ["tornado", tornadoStyles],
  ["wind", windStyles],
  ["hail", windStyles],
]);

export const getStyle = (type, risk) => styles.get(type)?.get(risk);
