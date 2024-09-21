import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  getTopicIdByClassNameAndTopicName,
  getTopicsByClassId,
} from "#models/topic/index.js";

const router = express.Router();
router.use(isAuthenticated);

router.get("/:classId", async function (req, res) {
  try {
    const result = await getTopicsByClassId(req.params.classId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

router.get("/:topicName/:className", async function (req, res) {
  try {
    const result = await getTopicIdByClassNameAndTopicName(
      req.params.topicName,
      req.params.className
    );
    res.status(200).json({ id: result[0].id, name: result[0].name });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

export default router;
