import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  upsertGroupInClass,
  getGroupsByClassId,
  getGroupsByUserId,
} from "#models/group/index.js";
import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import { isCreator } from "#middleware/creatorMiddleware";

const router = express.Router();
router.use(isAuthenticated);

router.get("/user/:type", async function (req, res) {
  try {
    const result = await getGroupsByUserId(req.user, req.params.type);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `getting groups by user id ${req.user} and type ${req.params.type} failed`,
    });
  }
});

router.get("/:type/:classId", async function (req, res) {
  try {
    const result = await getGroupsByClassId(
      req.params.classId,
      req.params.type
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `getting groups by class id ${req.params.classId} and type ${req.params.type} failed`,
    });
  }
});

router.delete("/:group_id", async function (req, res) {
  try {
    const group_id = parseInt(req.params.group_id);
    const result = await cascadeSetDeleted(
      req.user,
      "group",
      group_id,
      0,
      1,
      1,
      1
    );
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: `failed to delete group by id ${req.params.group_id}` });
  }
});
// type must be for now topic || exam
router.post("/:type", isCreator, async function (req, res) {
  const data = req.body;
  try {
    if (!req.params.type || !data.name || !data.desc || !data.class_id) {
      res.status(400).json({
        message: `pls pass in all agrs`,
      });
      return;
    }
    const result = await upsertGroupInClass(
      req.user,
      data.class_id,
      req.params.type,
      data.name,
      data.desc,
      data?.id
    );
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `failed to create group by class id ${data.class_id}`,
    });
  }
});

export default router;
