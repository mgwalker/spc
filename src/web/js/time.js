import dayjs from "dayjs";

export default () => {
  for (const time of document.getElementsByTagName("time")) {
    const iso = time.getAttribute("datetime");
    const ts = dayjs(iso);
    time.innerText = ts.format("MMMM D [at] h:mma");
  }
};
