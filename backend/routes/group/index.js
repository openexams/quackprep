import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  addExamToClass,
  addTopicToClass,
  getExamsByClassId,
  getTopicIdByClassNameAndTopicName,
  getTopicsByClassId,
} from "#models/group/index.js";

const router = express.Router();
router.use(isAuthenticated);

router.get("/topic/:classId", async function (req, res) {
  try {
    const result = await getTopicsByClassId(req.params.classId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "topic fail" });
  }
});

router.get("/topic/:topicName/:className", async function (req, res) {
  try {
    const result = await getTopicIdByClassNameAndTopicName(
      req.params.topicName,
      req.params.className
    );
    res.status(200).json({ id: result[0].id, name: result[0].name });
  } catch (error) {
    res.status(500).json({ message: "topic fail" });
  }
});

router.post("/topic/", async function (req, res) {
  try {
    const data = req.body;
    if (!data.name || !data.class_id) {
      throw new Error("bruh");
    }
    const result = await addTopicToClass(
      data.name,
      data.class_id,
      data.description,
      req.user
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "topic fail" });
  }
});

router.post("/exam/", async function (req, res) {
  try {
    const data = req.body;
    if (!data.year || !data.class_id || !data.semester || !data.exam_num) {
      throw new Error("bruh");
    }
    const result = await addExamToClass(
      data.class_id,
      data.year,
      data.semester,
      data.exam_num,
      req.user
    );
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: `fail to add exam to class id ${data.class_id}` });
  }
});

// EXAM group pull in

router.get("/exam/:class_id", async function (req, res) {
  try {
    const result = await getExamsByClassId(req.params.class_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to pull in exams by class id ${req.params.class_id}`,
    });
  }
});

export default router;
