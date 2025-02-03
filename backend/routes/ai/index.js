import { isAuthenticated } from "#middleware/authMiddleware.js";
import { verifyUserOwnsRowId } from "#utils/sqlFunctions.js";
import { generateQuestionLike } from "#models/ai/question.js";
import {
  MAX_FILE_SIZE_IN_BYTES,
  MAX_FILES_UPLOAD,
  MAX_USER_ANSWER_SUBMISSION_LENGTH,
  MAX_USER_PROMPT_LENGTH,
} from "../../../constants.js";
import { etlFilesIntoGroup } from "#models/ai/group.js";
import { checkStudentFRQAnswer } from "#models/ai/choice.js";
import { Router } from "express";
import multer from "multer";
import {
  CONTEXT_TOO_LONG,
  MISSING_REQUIRED_FIELDS,
  ANSWER_TO_BE_GRADED_TO_LONG,
} from "../../../error_codes.js";
import { BadRequestError } from "#utils/ApiError.js";
import { sendChatbotPromptAndRecieveResult } from "#models/ai/chatbot.js";

const router = Router();
router.use(isAuthenticated);

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE_IN_BYTES },
}); // Store files in memory

router.post("/chatbot/", async function (req, res, next) {
  const data = req.body;
  if (!data.messages) {
    next(new BadRequestError("please send all required body", null));
    return;
  }
  try {
    const result = await sendChatbotPromptAndRecieveResult(
      data.messages,
      data.model
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/group/",
  upload.array("files", MAX_FILES_UPLOAD),
  async (req, res, next) => {
    try {
      const {
        files,
        body: { class_id, prompt: user_given_context },
      } = req;

      if (user_given_context?.length > MAX_USER_PROMPT_LENGTH) {
        throw new BadRequestError(
          `User context exceeds maximum length of ${MAX_USER_PROMPT_LENGTH}`,
          CONTEXT_TOO_LONG
        );
      }

      if (!files?.[0] || !class_id) {
        throw new BadRequestError(
          "Missing required fields: file and class_id",
          MISSING_REQUIRED_FIELDS
        );
      }

      const result = await etlFilesIntoGroup(
        files,
        class_id,
        req.user,
        user_given_context
      );
      res.status(201).json(result);
    } catch (error) {
      next(error); // Pass to error handler middleware
    }
  }
);

router.post("/choice/grade/", async function (req, res, next) {
  const data = req.body;
  if (!data.trans_id || !data.question_text || !data.student_answer_text) {
    next(new BadRequestError("please send all required body", null));
    return;
  }
  try {
    if (
      await verifyUserOwnsRowId(
        // since user can send a random trans_id and link data to it, make sure they own it.
        data.trans_id,
        req.user,
        "answers_transactional"
      )
    ) {
      const result = await checkStudentFRQAnswer(
        data.trans_id,
        data.question_text,
        data.student_answer_text,
        data?.correct_answer_text
      );
      res.status(201).json(result);
    } else {
      next(
        new BadRequestError(
          "YOU DONT OWN THE ROW YOU ARE TRYING TO MANIPULATE",
          null
        )
      );
    }
  } catch (error) {
    if (error.errorCode === ANSWER_TO_BE_GRADED_TO_LONG) {
      next(
        new BadRequestError(
          `answer too long to be graded, max len is ${MAX_USER_ANSWER_SUBMISSION_LENGTH}`,
          ANSWER_TO_BE_GRADED_TO_LONG
        )
      );
    } else {
      next(error);
    }
  }
});

router.post(
  "/question/question_like/",

  async function (req, res, next) {
    const data = req.body;
    if (!data.likeQuestionId || !data.likeQuestionText) {
      next(
        new BadRequestError(
          "please select a question for an example for the ai",
          null
        )
      );
      return;
    }
    try {
      const result = await generateQuestionLike(
        req.user,
        data.likeQuestionText,
        data.likeQuestionId
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
