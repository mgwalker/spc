export default () => {
  const controllers = Array.from(document.querySelectorAll("tab-controller"));

  controllers.forEach((controller) => {
    const tabs = Array.from(controller.querySelectorAll("tab-container"));

    const buttonContainer = document.createElement("div");
    controller.insertBefore(buttonContainer, controller.firstChild);

    for (let i = 0; i < tabs.length; i += 1) {
      const tab = tabs[i];

      const button = document.createElement("button");
      button.setAttribute("role", "button");
      button.innerText = tab.getAttribute("name");
      buttonContainer.append(button);

      button.addEventListener("click", () => {
        tabs.forEach((tab) => (tab.style.display = "none"));
        tab.style.display = "";
      });

      if (i > 0) {
        tab.style.display = "none";
      }
    }
  });
};
