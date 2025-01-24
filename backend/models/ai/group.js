import { addManyChoicesToQuestion } from "#models/choice/index.js";
import { upsertQuestion } from "#models/question/index.js";
import { postPdfAndRetriveParsedPdf } from "#utils/mathpix.js";
import { sendOpenAiAssistantPromptAndRecieveResult } from "#utils/openAi.js";
import FormData from "form-data";
import { upsertGroupInClass, deleteGroupById } from "#models/group/index.js";
import {
  MAX_USER_PROMPT_LENGTH,
  QUACK_CREAT_GROUP_ASS_ID,
} from "#config/constants.js";
/**
 *
 * @param {Express.Multer.File[]} files
 * @param {*} class_id
 * @param {*} user_id
 * @param {*} user_prompt
 */
export async function parsePdfIntoGroup(files, class_id, user_id, user_prompt) {
  user_prompt =
    user_prompt ??
    "parse through and only respond with whats needed based on the json schema";
  dlog(`prompt given: ${user_prompt}`);
  if (user_prompt.length > MAX_USER_PROMPT_LENGTH) {
    throw new Error("user prompt is too long");
  }
  let group = null;
  try {
    dlog(`${files.length} files detected`);
    let mdd_res = "";
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      dlog(file);
      if (!file) {
        throw new Error("no file when it says there is a file??");
      }
      const fileType = file.mimetype.split("/")[1];
      if (fileType === "pdf") {
        const formData = new FormData();
        formData.append("file", file.buffer, file.originalname);
        mdd_res += await postPdfAndRetriveParsedPdf(formData);
      } else {
        throw new Error(
          "file is not a pdf, support for all file types coming soon\nfor now convert to a pdf" // todo: support all file types
        );
      }
    }

    /**@type {import("../../../../shared-types/group.type.ts").GenGroup} */
    const GenGroupResponseJSON =
      await sendOpenAiAssistantPromptAndRecieveResult(
        QUACK_CREAT_GROUP_ASS_ID,
        `${mdd_res}\n${user_prompt}`,
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
