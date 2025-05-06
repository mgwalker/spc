import getConsolidatedData from "./data/getConsolidatedData.js";
import buildPages from "./web/buildPages.js";

const main = async () => {
  await getConsolidatedData();
  await buildPages();
};

if (process.argv[1] === import.meta.filename) {
  main();
}
