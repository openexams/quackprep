import { getBoilerClassAndParseToJsonClass } from "./func/class.js";
import { getExamJsonGroupsFromJsonClass } from "./func/exam.js";
import { boilerQuestionsToJsonQuestions } from "./func/question.js";
import { readFromFile, writeToFile } from "./helpers.js";

/**
 * @param {Object} options
 * @param {boolean} options.appendClassToOutputFile will read current output file and append the new class to it.
 * @param {boolean} options.downloadPDFS
 * @param {string} options.subject
 * @param {string} options.courseName
 */
export async function runEt(options = {}) {
  let finalJason = null;
  try {
    finalJason = await getBoilerClassAndParseToJsonClass(options);
    if (finalJason.length === 0) {
      throw new Error(
        "getBoilerClassAndParseToJsonClass() returned an array with no content"
      );
    }

    let totalQuestionsThatShouldBeAdded = 0;
    let actualQuestionsAdded = 0;
    for (let i = 0; i < finalJason.length; i++) {
      totalQuestionsThatShouldBeAdded += finalJason[i].questionCount;
      // for all returned classes
      const { groupJson, boilerQuestionIds } =
        await getExamJsonGroupsFromJsonClass(finalJason[i], {
          downloadPDFS: options.downloadPDFS,
        });
      finalJason[i].groups = groupJson;
      for (let j = 0; j < finalJason[i].groups.length; j++) {
        finalJason[i].groups[j].questions =
          await boilerQuestionsToJsonQuestions(boilerQuestionIds[j]);
        actualQuestionsAdded += finalJason[i].groups[j].questions.length;
      }
    }

    if (options && options.appendClassToOutputFile === true) {
      const result = JSON.parse(await readFromFile("json/finalJason.json"));
      console.log(
        "appended finalJason to current output file json/finalJason.json"
      );
      finalJason = [...finalJason, ...result];
    }
    await writeToFile(
      JSON.stringify(finalJason, null, 2),
      "json/finalJason.json"
    );

    console.log("Data successfully written to output/finalJason.json");

    // since some multiple part questions they have, I create just multiple seperate questions.
    if (totalQuestionsThatShouldBeAdded > actualQuestionsAdded) {
      throw new Error(
        `question amounts dont add up
    \ntotalQuestionsThatShouldBeAdded:${totalQuestionsThatShouldBeAdded}\nactualQuestionsAdded:${actualQuestionsAdded}`
      );
    }
  } catch (error) {
    console.log(error);
    try {
      await writeToFile(
        JSON.stringify(finalJason, null, 2),
        "json/finalJasonERRORED.json"
      );
    } catch (error) {
      console.error("Errored writing to file", error);
    }
  }
}

// stat econ and phys done BIOL20400
// CHM11500 only has topics no exams.

await runEt({
  appendClassToOutputFile: true,
  downloadPDFS: true,
  subject: "Mathematics",
});

// proxy code
// app.use('/proxy', async (req, res) => {
//   const url = req.url;

//   try {
//     // Forward the request using axios
//     const response = await axios({
//       method: req.method,
//       url: url,
//       data: req.body, // Forward the request body
//       headers: req.headers // Forward the request headers
//     });

//     // Send the response back to the client
//     res.status(response.status).send(response.data);
//   } catch (err) {
//     console.error('Proxy error:', err);
//     res.status(500).send('Proxy error');
//   }
// });
