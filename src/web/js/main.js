import initTabs from "./tabs";
import createMaps from "./maps";
import time from "./time";

const main = () => {
  createMaps();
  initTabs();
  time();
};

document.addEventListener("DOMContentLoaded", main);
