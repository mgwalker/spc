import leaflet from "leaflet";
import { getStyle } from "./mapStyles";

export default () => {
  const maps = document.querySelectorAll("risk-map");
  for (const map of maps) {
    map.id = window.crypto.randomUUID();
    // map.style.height = "500px";
    map.style.display = "block";

    const l = leaflet.map(map.id);

    leaflet
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(l);

    const legendKeys = [];

    const layers = Array.from(map.querySelectorAll("map-layer")).map(
      (element) => {
        const layerData = JSON.parse(
          decodeURIComponent(element.getAttribute("data")),
        );
        element.removeAttribute("data");

        const style = getStyle(
          layerData.properties.type,
          layerData.properties.risk,
        );

        legendKeys.push({
          style,
          value: layerData.properties.risk,
        });

        const layer = leaflet.geoJSON(layerData, { style });
        layer.addTo(l);
        return layer;
      },
    );

    l.fitBounds(leaflet.featureGroup(layers).getBounds(), { maxZoom: 5 });

    const legend = map.parentElement.querySelector("map-legend");
    if (legend) {
      legendKeys.forEach(({ style, value }) => {
        if (style && value) {
          const item = document.createElement("legend-item");

          const box = document.createElement("div");
          box.setAttribute(
            "style",
            `--legend-item-color:${style.color}${Math.round(style.fillOpacity * 256).toString(16)};
            --legend-item-border-color:${style.color}`,
          );

          item.appendChild(box);

          item.appendChild(document.createTextNode(value));

          legend.appendChild(item);
        }
      });
    }
  }
};
