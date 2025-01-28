import { addManyChoicesToQuestion } from "#models/choice/index.js";
import { upsertQuestion } from "#models/question/index.js";
import {
  postImageAndRecieveText,
  postPdfAndRetriveParsedPdf,
} from "#utils/mathpix.js";
import { sendOpenAiAssistantPromptAndRecieveResult } from "#utils/openAi.js";
import FormData from "form-data";
import { upsertGroupInClass, deleteGroupById } from "#models/group/index.js";
import {
  MAX_FILE_SIZE_IN_BYTES,
  QUACK_CREATE_GROUP_ASS_ID,
} from "#config/constants.js";
import { FILE_SIZE_EXCEEDED } from "#config/error_codes.js";
import CustomError from "#utils/CustomError.js";

/**
 *
 * @param {Express.Multer.File[]} files
 * @param {*} class_id
 * @param {*} user_id
 * @param {*} user_prompt
 */
export async function etlFilesIntoGroup(files, class_id, user_id, user_prompt) {
  user_prompt =
    user_prompt ??
    "parse through and only respond with whats needed based on the json schema";
  dlog(`prompt given: ${user_prompt}`);
  let group = null;
  try {
    dlog(`${files.length} files detected`);
    let mdd_res = "";
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_FILE_SIZE_IN_BYTES) {
        throw new CustomError("File size exceeded", 400, FILE_SIZE_EXCEEDED);
      }
      const fileType = file?.mimetype?.split("/")?.[1];
      dlog(file);
      if (!file) {
        throw new Error("no file when it says there is a file??");
      } else if (fileType === "pdf") {
        const formData = new FormData();
        formData.append("file", file.buffer, file.originalname);
        mdd_res += await postPdfAndRetriveParsedPdf(formData);
      } else {
        mdd_res += await postImageAndRecieveText(file.buffer); // file .buffer is in base 64
      }
    }

    /**@type {import("../../../../shared-types/group.type.ts").GenGroup} */
    const GenGroupResponseJSON =
      await sendOpenAiAssistantPromptAndRecieveResult(
        QUACK_CREATE_GROUP_ASS_ID,
        `${mdd_res}\n${user_prompt}`,
        { retire_time: 10000 }
      );
    group = await upsertGroupInClass(
      user_id,
      class_id,
      GenGroupResponseJSON.group_type,
      GenGroupResponseJSON.group_name,
      GenGroupResponseJSON.group_description,
      null
    );
    for (let i = 0; i < GenGroupResponseJSON.questions.length; i++) {
      // this is server intensive can i fix this?
      const curQuestion = GenGroupResponseJSON.questions[i];
      const question = await upsertQuestion(
        // TODO how can i give topics to these questions?
        null,
        curQuestion.question,
        user_id,
        [group.id],
        true // these are ai.
      );
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
