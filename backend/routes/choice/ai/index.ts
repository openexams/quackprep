import { isAuthenticated } from "#middleware/authMiddleware";
import { checkStudentFRQAnswer } from "#models/choice/ai";
import { verifyUserOwnsRowId } from "#utils/sqlFunctions";
import { commonErrorMessage } from "#utils/utils";
import { Router, Request, Response } from "express";
const router = Router();

router.post(
  "/gradeai",
  isAuthenticated,
  async function (req: Request, res: Response) {
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
      commonErrorMessage(
        res,
        400,
        "failed to have ai grade your answer",
        error
      );
    }
  }
);

export default router;
