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
} from "../../../constants.js";
import { FILE_SIZE_EXCEEDED, SUCCESS } from "../../../error_codes.js";
import CustomError, { BadRequestError } from "#utils/ApiError.js";
import { sendEmailToUserByUserId } from "#models/account/index.js";
import { getSchoolByClassId } from "#models/class/index.js";

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
        throw new BadRequestError("File size exceeded", FILE_SIZE_EXCEEDED);
      }
      const fileType = file?.mimetype?.split("/")?.[1];
      dlog(file);
      if (!file) {
        throw new BadRequestError("No file found when expected");
      } else if (fileType === "pdf") {
        const formData = new FormData();
        formData.append("file", file.buffer, file.originalname);
        mdd_res += await postPdfAndRetriveParsedPdf(formData);
      } else {
        mdd_res += await postImageAndRecieveText(file.buffer); // file .buffer is in base 64
      }
    }

    /**@type {import("../../../shared-types/group.type.js").GenGroup} */
    const GenGroupResponseJSON =
      await sendOpenAiAssistantPromptAndRecieveResult(
        QUACK_CREATE_GROUP_ASS_ID,
        `${mdd_res}\n${user_prompt}`,
        { retire_time: 10000, max_retires: 60 } // this part can run for 10 mins max
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

    // for email ////////////////////
    const { school_name } = await getSchoolByClassId(class_id);
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-color: #4caf50;
      color: #ffffff;
      padding: 20px;
      text-align: center;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .content h1 {
      font-size: 20px;
      margin-bottom: 10px;
      color: #4caf50;
    }
    .content p {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .footer {
      text-align: center;
      padding: 10px;
      background-color: #f1f1f1;
    }
    .footer img {
      width: 150px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Your Group is Ready!
    </div>
    <div class="content">
      <h1>Welcome to Your New Group</h1>
      <p>Your group <strong>${group.name}</strong> has been successfully added!</p>
      <a href="https://quackprep.com/class/${school_name}/${class_id}/group/${group.id}/question/">Click here to view your group and start studying!</a>
      <p>We're excited to have you as part of QuackPrep!</p>
    </div>
    <div class="footer">
      <p>Powered by QuackPrep</p>
      <img src="https://quackprep.com/img/quackprep_logo.webp" alt="QuackPrep Logo" />
    </div>
  </div>
</body>
</html>`;

    sendEmailToUserByUserId(
      // no need to await
      user_id,
      `Your Group ${group.name} Has Been Added!`,
      emailHTML
    );
    ///////////////////////////////////
    return SUCCESS;
  } catch (error) {
    if (group && group.id) {
      dlog("group detected and function failed, attempting to delete group");
      // cascade delete group if it was created
      await deleteGroupById(user_id, group.id);
      dlog(`successfully cascade deleted group_id: ${group.id}`);
    }
    throw error; // Let the error handler middleware handle it
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
