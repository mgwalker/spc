import initTabs from "./tabs";
import createMaps from "./maps";

const main = () => {
  createMaps();
  initTabs();
};

document.addEventListener("DOMContentLoaded", main);
