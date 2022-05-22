import { getGrandchildName } from "./more";
import { getChildName } from "./more/child";

export const awakeChild = () => {
  const childName = getChildName();
  return "Wake up, ".concat(childName).concat("!");
};

export const awakeGrandchild = () => {
  const grandchildName = getGrandchildName();
  return "Wake up, ".concat(grandchildName).concat("!");
};
