import { addManyChoicesToQuestion } from "#models/choice/index.js";
import { upsertQuestion } from "#models/question/index.js";
import { postPdfAndRetriveParsedPdf } from "#utils/mathpix.js";
import { sendOpenAiAssistantPromptAndRecieveResult } from "#utils/openAi.js";
import FormData from "form-data";
import { upsertGroupInClass, deleteGroupById } from "#models/group/index.js";
/**
 *
 * @param {Express.Multer.File[]} files
 * @param {*} class_id
 * @param {*} user_id
 * @param {*} prompt
 */
export async function parsePdfIntoGroup(files, class_id, user_id, prompt) {
  prompt =
    prompt ??
    "parse through and only respond with whats needed based on the json schema";
  dlog(`prompt given: ${prompt}`);
  let group = null;
  try {
    dlog(`${files.length} files detected`);
    let mdd_res = "";
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) {
        throw new Error("no file when it says there is a file");
      } else {
        const formData = new FormData();
        formData.append("file", file.buffer, file.originalname);
        mdd_res += await postPdfAndRetriveParsedPdf(formData);
      }
    }

    /**@type {import("../../../../shared-types/group.type.ts").GenGroup} */
    const GenGroupResponseJSON =
      await sendOpenAiAssistantPromptAndRecieveResult(
        "asst_UXDbP8qIkOJw50jN9OLp36oA",
        `${mdd_res}\n${prompt}`,
        { retire_time: 10000 }
      );
    group = (
      await upsertGroupInClass(
        user_id,
        class_id,
        GenGroupResponseJSON.group_type,
        GenGroupResponseJSON.group_name,
        GenGroupResponseJSON.group_description,
        null
      )
    )[0];
    for (let i = 0; i < GenGroupResponseJSON.questions.length; i++) {
      // this is server intensive can i fix this?
      const curQuestion = GenGroupResponseJSON.questions[i];
      const question = (
        await upsertQuestion(
          // how can i give topics to these questions?
          null,
          curQuestion.question,
          user_id,
          [group.id],
          true
        )
      )[0];
      await addManyChoicesToQuestion(question.id, user_id, curQuestion.options);
    }
  } catch (error) {
    if (group && group.id) {
      dlog("group detected and function failed, attempting to delete group");
      // cascade delete group if it was created
      await deleteGroupById(user_id, group.id);
      dlog(`successfully cascade deleted group_id: ${group.id}`);
    }
    console.error(error);
    throw error; // throw to route to handle it
  }
}
// add assitant ids to constant FILE

// testing
// const formData = new FormData();
// formData.append(
//   "file",
//   fs.createReadStream("./backend/models/group/ai/pd.pdf")
// );

// // await parsePdfIntoGroup(formData, null, null);
// await getFormattedPdfByPdfIdMathpix("2025_01_19_8b28c5b960393964aa50g");
