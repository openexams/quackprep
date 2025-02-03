import { getBoilerClassAndParseToJsonClass } from "./func/class.js";
import "../../backend/utils/utils.js";
import "../../backend/config/config.js";
import { getJsonGroupsFromJsonClass } from "./func/exam.js";

const finalJason = await getBoilerClassAndParseToJsonClass();
finalJason;
for (let i = 0; i < finalJason.length; i++) {
  // for all classes
  finalJason[i].groups = await getJsonGroupsFromJsonClass(finalJason[i]);
  for (let j = 0; j < finalJason[i].groups.length; j++) {
    finalJason[i].groups[j].questions = null; // TODO
  }
}
