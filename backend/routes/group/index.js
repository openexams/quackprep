import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  upsertGroupInClass,
  getGroupsByClassId,
  getGroupsByUserId,
  deleteGroupById,
} from "#models/group/index.js";
import { isCreator } from "#middleware/creatorMiddleware.js";
import { commonErrorMessage } from "#utils/utils.js";

const router = express.Router();

router.get("/user/", isAuthenticated, async function (req, res) {
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

router.get("/:class_id/:type?", async function (req, res) {
  try {
    const result = await getGroupsByClassId(
      req.params.class_id,
      req.params.type
    );
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to get groups by class id ${req.params.classId} & type ${req.params.type} (if type passed in) `,
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
      const result = await deleteGroupById(req.user, group_id);
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

// type must be for now topic || exam changing now gay
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
