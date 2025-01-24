import { isAuthenticated } from "#middleware/authMiddleware.js";
import { verifyUserOwnsRowId } from "#utils/sqlFunctions.js";
import { commonErrorMessage } from "#utils/utils.js";
import { generateQuestionLike } from "#models/ai/question.js";
import { MAX_FILES_UPLOAD, MAX_USER_PROMPT_LENGTH } from "#config/constants.js";
import { etlFilesIntoGroup } from "#models/ai/group.js";
import { checkStudentFRQAnswer } from "#models/ai/choice.js";
import rateLimit from "express-rate-limit";
import { Router } from "express";
import multer from "multer";

const router = Router();

router.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 min
    limit: 2, // limit each IP to 2 requests per windowMs
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
      const prompt = req.body.prompt;

      if (prompt?.length > MAX_USER_PROMPT_LENGTH) {
        commonErrorMessage(
          res,
          400,
          `prompt is too long, max length is ${MAX_USER_PROMPT_LENGTH}`
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
      const result = await etlFilesIntoGroup(files, class_id, req.user, prompt);
      res.status(201).json(result);
    } catch (error) {
      commonErrorMessage(
        res,
        500,
        `failed to generate ai group in class ${req.body?.class_id}`,
        error
      );
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
        "YOU DONT OWN THE ROW YOU ARE TRYING TO EDIT",
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
      res.status(200).json(result);
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
