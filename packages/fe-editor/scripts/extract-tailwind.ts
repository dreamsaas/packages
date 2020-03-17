import fs from "fs";
import path from "path";

const styleSheet = fs.readFileSync(
  path.join(__dirname, "../src/styles/tailwind.css"),
  {
    encoding: "utf8"
  }
);

const stylesheetWithoutBackslash = styleSheet
  .replace("\\/", "/")
  .replace("\\:", ":");

const classList = stylesheetWithoutBackslash.match(
  /\.([A-Za-z0-9_\/-\:])*(.{)/g
);
const classListWithoutDot = classList!
  .map(item => item.replace(".", "").replace(" {", ""))
  .filter(item => item.includes("hover"));
console.log(new Set(classListWithoutDot));
//   console.log(classListWithoutDot);
