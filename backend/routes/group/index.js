import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  upsertGroupInClass,
  getGroupsByClassId,
  getGroupsByUserId,
} from "#models/group/index.js";
import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import { isCreator } from "#middleware/creatorMiddleware.js";
import { commonErrorMessage } from "#utils/utils.js";

const router = express.Router();

router.get("/user/:type", isAuthenticated, async function (req, res) {
  try {
    const result = await getGroupsByUserId(req.user, req.params.type);
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to get groups by user id ${req.user}`,
      error
    );
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
    commonErrorMessage(
      res,
      500,
      `failed to get groups by class id ${req.params.classId} and type ${req.params.type}`,
      error
    );
  }
});

router.delete(
  "/:group_id",
  isAuthenticated,
  isCreator,
  async function (req, res) {
    try {
      const group_id = parseInt(req.params.group_id);
      const result = await cascadeSetDeleted(
        req.user,
        "group",
        group_id,
        0,
        1,
        1,
        1,
        0
      );
      res.status(200).json(result);
    } catch (error) {
      commonErrorMessage(
        res,
        500,
        `failed to delete group ${req.params.group_id}`,
        error
      );
    }
  }
);
// type must be for now topic || exam
router.post("/:type", isAuthenticated, isCreator, async function (req, res) {
  const data = req.body;
  try {
    if (!req.params.type || !data.name || !data.desc || !data.class_id) {
      commonErrorMessage(
        res,
        400,
        `missing required fields need type, name, desc, class_id`
      );
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
    commonErrorMessage(
      res,
      500,
      `failed to create group in class ${req.body.class_id} and type ${req.params.type}`,
      error
    );
  }
});

export default router;
