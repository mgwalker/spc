import fs from "node:fs/promises";
import { days, getRisk } from "./metadata.js";

const fixupTimestamp = (ts) => {
  const [, year, month, day, hour, minute] = ts.match(
    /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/,
  );
  return `${year}-${month}-${day}T${hour}:${minute}:00Z`;
};

const fixupProperties = (feature, product) => {
  const { VALID, EXPIRE, ISSUE, LABEL } = feature.properties;

  return {
    valid: fixupTimestamp(VALID),
    expires: fixupTimestamp(EXPIRE),
    issued: fixupTimestamp(ISSUE),
    type: product.name,
    risk: getRisk(product.key, LABEL),
  };
};

const main = async () => {
  const data = { type: "FeatureCollection", features: [] };

  let dayNumber = 0;
  for await (const dayProducts of days) {
    dayNumber += 1;

    for await (const product of dayProducts) {
      const productData = await fetch(
        `https://www.spc.noaa.gov/products/outlook/day${dayNumber}otlk_${product.key}.nolyr.geojson`,
      )
        .then((r) => r.json())
        .then((d) => ({
          features: d.features.filter(
            (feature) =>
              feature.geometry.coordinates?.length > 0 ||
              feature.geometry.geometries?.length > 0,
          ),
        }));

      productData.features.forEach((feature) => {
        feature.properties = fixupProperties(feature, product);
        feature.properties.outlookDay = dayNumber;
      });

      data.features.push(...productData.features);
    }
  }

  const byDay = Object.groupBy(
    data.features,
    (feature) => feature.properties.outlookDay,
  );
  Object.entries(byDay).forEach(([key, day]) => {
    const byType = Object.groupBy(day, (feature) => feature.properties.type);
    byDay[key] = byType;
  });

  await fs.writeFile("docs/outlook.geojson", JSON.stringify(data, null, 2));
  await fs.writeFile("docs/outlook.json", JSON.stringify(byDay, null, 2));
};

if (process.argv[1] === import.meta.filename) {
  main();
}

export default main;
