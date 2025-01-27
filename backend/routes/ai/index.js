import { isAuthenticated } from "#middleware/authMiddleware.js";
import { verifyUserOwnsRowId } from "#utils/sqlFunctions.js";
import { commonErrorMessage } from "#utils/utils.js";
import { generateQuestionLike } from "#models/ai/question.js";
import {
  AI_ROUTES_RATE_LIMIT_PER_MIN,
  MAX_FILES_UPLOAD,
  MAX_USER_PROMPT_LENGTH,
} from "#config/constants.js";
import { etlFilesIntoGroup } from "#models/ai/group.js";
import { checkStudentFRQAnswer } from "#models/ai/choice.js";
import rateLimit from "express-rate-limit";
import { Router } from "express";
import multer from "multer";
import { FILE_SIZE_EXCEEDED, AI_PROMPT_TOO_LONG } from "#config/error_codes.js";

const router = Router();

router.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 min
    limit: AI_ROUTES_RATE_LIMIT_PER_MIN,
  })
);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); // Store files in memory

router.post(
  "/group/",
  isAuthenticated,
  upload.array("files", MAX_FILES_UPLOAD),
  async function (req, res) {
    try {
      const files = req.files;
      const class_id = req.body.class_id;
      const user_given_context = req.body.prompt;

      if (user_given_context?.length > MAX_USER_PROMPT_LENGTH) {
        commonErrorMessage(
          res,
          400,
          `user_given_context is too long, max length is ${MAX_USER_PROMPT_LENGTH}`
        );
        return;
      }

      if (!files[0] || !class_id) {
        commonErrorMessage(
          res,
          400,
          `missing required fields: need file and class_id`
        );
        return;
      }

      // Process file (stored in memory or temporary location)
      const result = await etlFilesIntoGroup(
        files,
        class_id,
        req.user,
        user_given_context
      );
      res.status(201).json(result);
    } catch (error) {
      if (error.errorCode === FILE_SIZE_EXCEEDED) {
        commonErrorMessage(
          res,
          400,
          "one of your file's size is too large. use compression to reduce file size.",
          error
        );
      } else if (error.errorCode === AI_PROMPT_TOO_LONG) {
        commonErrorMessage(
          res,
          400,
          "The prompt is too long, contact support for assistance, or try uploading different files",
          error
        );
      } else {
        commonErrorMessage(
          res,
          500,
          `failed to generate ai group in class ${req.body?.class_id}`,
          error
        );
      }
    }
  }
);

router.post("/choice/grade/", isAuthenticated, async function (req, res) {
  const data = req.body;
  if (!data.trans_id || !data.question_text || !data.student_answer_text) {
    commonErrorMessage(res, 400, "please send all required body", null);
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
      commonErrorMessage(
        res,
        400,
        "YOU DONT OWN THE ROW YOU ARE TRYING TO MANIPULATE",
        null
      );
      return;
    }
  } catch (error) {
    commonErrorMessage(res, 400, "failed to have ai grade your answer", error);
  }
});

router.post(
  "/question/question_like/",
  isAuthenticated,
  async function (req, res) {
    const data = req.body;
    if (!data.likeQuestionId || !data.likeQuestionText) {
      commonErrorMessage(
        res,
        400,
        "please select a question for an example for the ai"
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
      commonErrorMessage(
        res,
        500,
        `failed to gen fav question based on question_id: ${data?.likeQuestionId}`,
        error
      );
    }
  }
);

export default router;
