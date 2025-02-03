import { getBoilerClassAndParseToJsonClass } from "./func/class.js";
import "../../backend/utils/utils.js";
import "../../backend/config/config.js";
import { getJsonGroupsFromJsonClass } from "./func/exam.js";
import { boilerQuestionsToJsonQuestions } from "./func/question.js";
import { JSONClassSchema } from "./schema/schema.js";

const finalJason = await getBoilerClassAndParseToJsonClass();
for (let i = 0; i < finalJason.length; i++) {
  // for all classes
  const { groupJson, boilerQuestionIds } = await getJsonGroupsFromJsonClass(
    finalJason[i]
  );
  finalJason[i].groups = groupJson;
  for (let j = 0; j < finalJason[i].groups.length; j++) {
    finalJason[i].groups[j].questions = await boilerQuestionsToJsonQuestions(
      boilerQuestionIds[j]
    );
  }
}
// final, however it will always pass if the first function call passed, I need to make things not nullable in this check.
JSONClassSchema.array().parse(finalJason);
