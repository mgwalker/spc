import fs from "node:fs/promises";
import { days, getRisk } from "./metadata.js";
import getDiscussion from "./getDiscussion.js";
import path from "node:path";
import fetch from "./fetch.js";

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
    risk: getRisk(product.key, LABEL) ?? "",
  };
};

const main = async () => {
  const data = { type: "FeatureCollection", features: [] };

  let dayNumber = 0;
  for await (const dayProducts of days) {
    dayNumber += 1;

    for await (const product of dayProducts) {
      const url = `https://www.spc.noaa.gov/products/outlook/day${dayNumber}otlk_${product.key}.nolyr.geojson`;

      const productData = await fetch(url)
        .then((r) => r.json())
        .then(async (d) => {
          await fs.writeFile(
            path.join("raw", encodeURIComponent(url)),
            JSON.stringify(d, null, 2),
          );

          return {
            features: d.features.filter(
              (feature) =>
                feature.geometry.coordinates?.length > 0 ||
                feature.geometry.geometries?.length > 0,
            ),
          };
        })
        .catch((e) => {
          console.log(e);
        });

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
  await Promise.all(
    Object.entries(byDay).map(async ([key, day]) => {
      const byType = Object.groupBy(day, (feature) => feature.properties.type);
      byDay[key] = byType;

      byDay[key].discussion = await getDiscussion(key);
    }),
  );

  await fs.writeFile("docs/outlook.geojson", JSON.stringify(data, null, 2));
  await fs.writeFile("docs/outlook.json", JSON.stringify(byDay, null, 2));
};

if (process.argv[1] === import.meta.filename) {
  main();
}

export default main;
