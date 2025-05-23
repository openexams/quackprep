import { addManyChoicesToQuestion } from "#models/choice/index.js";
import { upsertQuestion } from "#models/question/index.js";
import {
  postImageAndRecieveText,
  postPdfAndRetriveParsedPdf,
} from "#utils/mathpix.js";
import { sendOpenAiAssistantPromptAndRecieveResult } from "#utils/openAi.js";
import FormData from "form-data";
import {
  upsertGroupInClass,
  deleteGroupById,
  uploadFileLinkToGroup,
} from "#models/group/index.js";
import {
  DOMAIN_NAME,
  MAX_FILE_SIZE_IN_BYTES,
  NODE_ENVS_AVAILABLE,
  QUACK_CREATE_GROUP_ASS_ID,
} from "../../../constants.js";
import { FILE_SIZE_EXCEEDED } from "../../../error_codes.js";
import ApiError, { BadRequestError } from "#utils/ApiError.js";
import { sendEmailToUserByUserId } from "#models/account/index.js";
import { getSchoolByClassId } from "#models/class/index.js";
import { myS3Client } from "#config/config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { secrets } from "#config/secrets.js";
/**
 *
 * @param {Express.Multer.File} file
 */
function findFilesType(file) {
  return file.mimetype.split("/")[1];
}

/**
 * Uploads a file to s3 given a multer file and a bucket to upload it to.
 * @param {String} folder
 * @param {Express.Multer.File} file must have props originalname, mimetype, buffer
 */
async function uploadFileToS3(folder, file) {
  const uuid = `${new Date().getTime()}_${file.originalname}`;
  const data_to_send = new PutObjectCommand({
    Bucket: folder,
    Key: uuid,
    ContentType: file.mimetype,
    Body: file.buffer,
  });
  await myS3Client.send(data_to_send);
  return uuid;
}

/**
 *
 * @param {Express.Multer.File[]} files
 * @param {Number} class_id
 * @param {Number} user_id
 * @param {String} user_prompt
 * @param {Object} options
 * @param {Boolean} options.save_pdf if true, will save the pdf to s3 and link it to the group
 * @returns {Number} group_id the created group's id
 */

export async function etlFilesIntoGroup(
  files,
  class_id,
  user_id,
  user_prompt,
  options = {}
) {
  user_prompt =
    user_prompt ??
    "parse through and only respond with whats needed based on the json schema";
  dlog(`prompt given: ${user_prompt}`);
  let group = null; // used to check if group was created
  try {
    dlog(`${files.length} files detected`);
    let mdd_res = "";
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_FILE_SIZE_IN_BYTES) {
        throw new BadRequestError("File size exceeded", FILE_SIZE_EXCEEDED);
      }
      const fileType = findFilesType(file);
      dlog(file);
      if (!file) {
        throw new BadRequestError("No file found when expected");
      } else if (fileType === "pdf") {
        const formData = new FormData();
        formData.append("file", file.buffer, file.originalname);
        mdd_res += await postPdfAndRetriveParsedPdf(formData);
      } else {
        // must be a valid image
        mdd_res += await postImageAndRecieveText(file); // file .buffer is in base 64
      }
    }

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
    if (!group.id) {
      throw new Error("group id not found when group id is needed");
    }
    try {
      dlog(`user choose save_pdf: ${options?.save_pdf}`);
      if (
        secrets.NODE_ENV === NODE_ENVS_AVAILABLE.prod &&
        options?.save_pdf === true
      ) {
        for (let i = 0; i < files.length; i++) {
          const uuid = await uploadFileToS3("group_inserts", files[i]);
          uploadFileLinkToGroup(
            // dont want to await this.
            `https://bucket.${DOMAIN_NAME}/group_inserts/${uuid}`,
            group.id // TODO make a delete script thats deletes all deleted=0 and removes files not used, unless u rlly wanna save the filed I guess
          ).catch(() => console.log(`failed to upload file ${uuid}`));
        }
      }
    } catch (error) {
      console.log("failed to upload files to s3");
      console.error(error);
    } // just continue after this, I want this because it may result in bad data but ux matters more.

    for (let i = 0; i < GenGroupResponseJSON.questions.length; i++) {
      // this is server intensive can i fix this? -maddox -> no you never can and never will.
      const curQuestion = GenGroupResponseJSON.questions[i];
      const question = await upsertQuestion(
        // TODO how can i give topics to these questions?
        null,
        curQuestion.question,
        user_id,
        [group.id],
        false // these are ai, however user should make sure they inserted correctly. as such they are not marked as ai.
      );
      await addManyChoicesToQuestion(question.id, user_id, curQuestion.options);
    }

    console.log("successfully etlFilesIntoGroup, sending email now!");

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
      <a href="https://quackprep.com/class/${school_name}/${class_id}/group/${group.id}/question">Click here to view your group and start studying!</a>
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
    ).catch(() => console.log(`failed to send email to user_id:${user_id}`));
    ///////////////////////////////////
    console.log(`returning groupid: ${group.id} to user`);
    return group.id;
  } catch (error) {
    if (group && group.id) {
      dlog("group detected and function failed, attempting to delete group");
      //set delete group if it was created and everything under it.
      await deleteGroupById(user_id, group.id);
      dlog(`successfully cascade deleted group_id: ${group.id}`);
    }
    console.error(error);

    throw error; // Let the error handler middleware handle it
  }
}
