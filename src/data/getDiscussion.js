import fs from "node:fs/promises";
import path from "node:path";
import { JSDOM } from "jsdom";
import fetch from "./fetch.js";

const main = async (day) => {
  const url = `https://www.spc.noaa.gov/products/outlook/day${day}otlk.html`;

  const dom = await fetch(url)
    .then((r) => r.text())
    .then(async (t) => {
      await fs.writeFile(path.join("raw", encodeURIComponent(url)), t);
      return t;
    })
    .then((t) => new JSDOM(t));

  const content = dom.window.document
    .querySelector("table pre")
    .textContent.split("\n")
    .slice(8)
    .map((l) => l.trim())
    .join("\n")
    .trim()
    .split("\n\n");

  const discussion = { headline: null, blocks: [] };

  content.map((block) => {
    // If the entire block is wrapped in triple dots, then it is the discussion
    // headline. Extract that accordingly.
    if (/^\.\.\.[\s\S]+\.\.\.$/.test(block) && !discussion.headline) {
      discussion.headline = block
        .replace(/^\.\.\./, "")
        .replace(/\.\.\.$/, "")
        .replace(/\n/g, " ");
    }
    // If the block starts with triple dots, some text that is unbroken by a
    // newline, and triple dots again, we're starting a content block.
    else if (/^\.\.\.[^\.\n]+\.\.\./.test(block)) {
      const parts = block.split("\n");

      // The first line is the block heading. It begins with triple dots, so
      // strip those off.
      const heading = parts[0].replace(/\.\.\./g, "");

      // The content is everything after that, so we can reassemble it now.
      const content = parts.slice(1).join(" ");

      discussion.blocks.push({
        type: "block",
        heading,
        content: [content],
      });
    }
    // If the block is completely contained within triple dots but DOES have
    // newlines in it, then this is a content-less heading.
    else if (/^\.\.\.[^\.]+\.\.\./i.test(block)) {
      discussion.blocks.push({
        type: "block",
        heading: block.replace(/\n/g, " ").replace(/\.\.\./g, ""),
        content: [],
      });
    }
    // If the block begins with two dots, then it is author information
    else if (/^\.\.[^\.]+\.\./.test(block)) {
      const [, author] = block.match(/^\.\.([^\.]+)\.\./);
      discussion.blocks.push({
        type: "author",
        content: author,
      });
    }
    // Some discussions are updates to previous ones, and the previous one is
    // included in whole. That's great! But we need to capture the heading
    // that indicates that.
    else if (/^\.PREV DISCUSSION/i.test(block)) {
      const [, time, month, day, year] = block.match(
        /\/ISSUED (\d{4} [AP]M \S+) \S+ (\S+) (\d{1,2}) (\d{4})/i,
      );

      discussion.blocks.push({
        type: "previous",
        content: `${month} ${day.replace(/^0/, "")}, ${year} at ${time.replace(/^(\d{2})/, "$1:").replace(/^0/, "")}`,
      });
    }
    // If the block does NOT start with a dot at all, then it is either a
    // continuation of the previous content block, or it is extraneous stuff.
    else if (!/^\./.test(block)) {
      // The discussions sometimes include a "CLICK HERE" text blob and/or a
      // "NOTE: THE NEXT DAY [X] OUTLOOK IS SCHEDULED BY [Y]" text. We don't
      // particularly care for either of those. (Maybe we should keep the
      // scheduling information?) For now, ignore those.
      if (
        !block.startsWith("CLICK") &&
        !block.startsWith("NOTE: THE NEXT DAY")
      ) {
        const content = block.replace(/\n/g, "");

        if (discussion.blocks.length === 0) {
          discussion.blocks.push({ type: "paragraph", content: [content] });
        } else {
          const index = discussion.blocks.length - 1;
          const parentType = discussion.blocks[index].type;

          if (parentType === "block") {
            discussion.blocks[index].content.push(content);
          } else {
            discussion.blocks.push({ type: "paragraph", content: [content] });
          }
        }
      }
    }
  });

  return discussion;
};

if (process.argv[1] === import.meta.filename) {
  main(process.argv[2]);
}

export default main;
