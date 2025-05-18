import handlebars from "handlebars";

handlebars.registerHelper("block", (obj) => {
  switch (obj.type) {
    case "block": {
      const text = obj.content.map((t) => `<p>${t}</p>`).join("");
      return new handlebars.SafeString(`<h3>${obj.heading}</h3>${text}`);
    }
    case "author":
      return new handlebars.SafeString(
        `<author>Authored by ${obj.content}</author>`,
      );
    case "previous":
      return new handlebars.SafeString(
        `<hr/><h3>Repeating previous discussion, issued ${obj.content}</h3>`,
      );
    case "paragraph": {
      const text = obj.content.map((t) => `<p>${t}</p>`).join("");
      return new handlebars.SafeString(`<p>${text}</p>`);
    }

    default:
      console.log(`No idea what to do with ${obj.type}`);
      return "";
  }
});
