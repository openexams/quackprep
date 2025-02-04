import { getBoilerClassAndParseToJsonClass } from "./func/class.js";
import { getJsonGroupsFromJsonClass } from "./func/exam.js";
import { boilerQuestionsToJsonQuestions } from "./func/question.js";
import { writeToFile } from "./helpers.js";
let finalJason = null;
try {
  finalJason = await getBoilerClassAndParseToJsonClass();
  if (finalJason.length === 0) {
    throw new Error(
      "getBoilerClassAndParseToJsonClass() returned an array with no content"
    );
  }
  let totalQuestionsThatShouldBeAdded = 0;
  let actualQuestionsAdded = 0;
  for (let i = 0; i < finalJason.length; i++) {
    totalQuestionsThatShouldBeAdded += finalJason[i].questionCount;
    // for all classes
    const { groupJson, boilerQuestionIds } = await getJsonGroupsFromJsonClass(
      finalJason[i]
    );
    finalJason[i].groups = groupJson;
    for (let j = 0; j < finalJason[i].groups.length; j++) {
      finalJason[i].groups[j].questions = await boilerQuestionsToJsonQuestions(
        boilerQuestionIds[j]
      );
      actualQuestionsAdded += finalJason[i].groups[j].questions.length;
    }
  }
  await writeToFile(
    JSON.stringify(finalJason, null, 2),
    "json/finalJason.json"
  );

  console.log("Data successfully written to output/finalJason.json");

  if (totalQuestionsThatShouldBeAdded !== actualQuestionsAdded) {
    throw new Error(
      `question amounts dont add up
    \ntotalQuestionsThatShouldBeAdded:${totalQuestionsThatShouldBeAdded}\nactualQuestionsAdded:${actualQuestionsAdded}`
    );
  }
} catch (error) {
  await writeToFile(finalJason, "output/finalJasonERRORED.json");
  console.error("Error in run-et.js", error);
}
