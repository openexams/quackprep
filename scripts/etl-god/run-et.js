import { getBoilerClassAndParseToJsonClass } from "./func/class.js";
import "../../backend/utils/utils.js";
import "../../backend/config/config.js";
import { getJsonGroupsCallBoilerFromJsonClass } from "./func/exam.js";

const finalJason = await getBoilerClassAndParseToJsonClass();
finalJason;
for (let i = 0; i < finalJason.length; i++) {
  const jsonGroup = await getJsonGroupsCallBoilerFromJsonClass(finalJason[i]);
  finalJason[i].groups = jsonGroup;
  // now go into each group and add question etc
}
