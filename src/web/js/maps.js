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

    const layers = Array.from(map.querySelectorAll("map-layer")).map(
      (element) => {
        const layerData = JSON.parse(
          decodeURIComponent(element.getAttribute("data")),
        );
        element.removeAttribute("data");

        const layer = leaflet.geoJSON(layerData, {
          style: (feature) =>
            getStyle(feature.properties.type, feature.properties.risk),
        });
        layer.addTo(l);
        return layer;
      },
    );

    l.fitBounds(leaflet.featureGroup(layers).getBounds(), { maxZoom: 5 });
  }
};
