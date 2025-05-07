import fs from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";
import * as sass from "sass-embedded";
import handlebars from "handlebars";
import "./renderBlock.js";

const main = async () => {
  handlebars.registerHelper("json", (obj) =>
    encodeURIComponent(JSON.stringify(obj)),
  );

  const source = await fs.readFile(
    path.join(import.meta.dirname, "template.handlebars"),
    {
      encoding: "utf-8",
    },
  );
  const template = handlebars.compile(source);

  const data = JSON.parse(await fs.readFile("./docs/outlook.json"));

  for await (const day of Object.keys(data)) {
    const types = Object.keys(data[day]).filter((t) => t != "discussion");

    const prev =
      +day > 1 ? { name: `day ${+day - 1}`, url: `day${+day - 1}.html` } : null;
    const next =
      +day < 3 ? { name: `day ${+day + 1}`, url: `day${+day + 1}.html` } : null;

    if (prev?.name === "day 1") {
      prev.url = "index.html";
    }

    const rendered = template({
      outlookDay: day,
      types,
      data: data[day],
      prev,
      next,
    });
    await fs.writeFile(
      `docs/${day === "1" ? "index" : `day${day}`}.html`,
      rendered,
    );
  }

  await build({
    entryPoints: [path.join(import.meta.dirname, "js", "main.js")],
    bundle: true,
    format: "esm",
    minify: true,
    outdir: "docs",
  });

  const { css } = sass.compile(
    path.join(import.meta.dirname, "scss", "main.scss"),
  );
  await fs.writeFile("docs/main.css", css);
};

if (process.argv[1] === import.meta.filename) {
  main();
}

export default main;
