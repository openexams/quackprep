import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  upsertGroupInClass,
  getGroupsByClassId,
  getGroupsByUserId,
  deleteGroupById,
} from "#models/group/index.js";
import { isCreator } from "#middleware/creatorMiddleware.js";
import { BadRequestError } from "#utils/ApiError.js";

const router = express.Router();

router.get("/user/", isAuthenticated, async function (req, res, next) {
  try {
    const result = await getGroupsByUserId(req.user, req.params.type);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:class_id/:type?", async function (req, res, next) {
  try {
    const result = await getGroupsByClassId(
      req.params.class_id,
      req.params.type
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:group_id",
  isAuthenticated,
  isCreator,
  async function (req, res, next) {
    try {
      const group_id = parseInt(req.params.group_id);
      const result = await deleteGroupById(req.user, group_id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// type must be for now topic || exam changing now gay
router.post(
  "/:type",
  isAuthenticated,
  isCreator,
  async function (req, res, next) {
    const data = req.body;
    try {
      if (!req.params.type || !data.name || !data.desc || !data.class_id) {
        return next(
          new BadRequestError(
            `missing required fields need type, name, desc, class_id`
          )
        );
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
      next(error);
    }
  }
);

export default router;
