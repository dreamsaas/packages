//@ts-ignore
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "./tailwind.js";
export const tailwindMerge = () => console.log("do nothing");

console.log(resolveConfig(tailwindConfig));
// export const tailwindMerge = (
//   currentClasses: string,
//   incomingClasses: string
// ) => {
//   const current = currentClasses.split(" ");
//   const incoming = incomingClasses.split(" ");

//   // todo

//   const xytrbl = (key: string) => [
//     key,
//     key + "x",
//     key + "y",
//     key + "t",
//     key + "r",
//     key + "b",
//     key + "l"
//   ];
//   const propertyGroups = [...xytrbl("p"), ...xytrbl("m")];

//   const properties = {};

//   current.forEach(item => {
//     const split = item.split("-");
//     if (split.length > 2) {
//       const [...first, last] = split;
//       split = [first.join("-"), last];
//     }
//   });
// };
