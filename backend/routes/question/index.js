import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import { getQuestionsByGroupId } from "#models/question/index.js";

const router = express.Router();
router.use(isAuthenticated);

router.get("/:type/:group_id", async function (req, res) {
  try {
    const result = await getQuestionsByGroupId(
      req.params.group_id,
      req.params.type
    );
    //console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to get question by group id ${req.params.group_id} and grouptype ${req.params.type}`,
    });
  }
});

// TODO ADD QUESTION TO GROUP
export default router;
