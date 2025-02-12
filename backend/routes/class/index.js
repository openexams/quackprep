import { isAuthenticated } from "#middleware/authMiddleware.js";
import { isCreator } from "#middleware/creatorMiddleware.js";
import {
  upsertClass,
  getClassesBySchoolId,
  getClassesByUserId,
  getSchools,
  getClassCategories,
  getTopRatedClasses,
} from "#models/class/index.js";
import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import express from "express";
import { GENERAL_SCHOOL_ID } from "../../../constants.js";
import { BadRequestError } from "#utils/ApiError.js";
import voteRouter from "./vote/index.js";
const router = express.Router();

router.use("/vote", voteRouter);

router.get("/user", isAuthenticated, async function (req, res, next) {
  try {
    const result = await getClassesByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/toprated", async function (req, res, next) {
  try {
    const result = await getTopRatedClasses(10);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/categories", async function (req, res, next) {
  try {
    const result = await getClassCategories();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:school_id", async function (req, res, next) {
  try {
    const result = await getClassesBySchoolId(req.params.school_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:class_id",
  isAuthenticated,
  isCreator,
  async function (req, res, next) {
    try {
      const class_id = parseInt(req.params.class_id);
      const result = await cascadeSetDeleted(
        req.user,
        "class",
        class_id,
        1,
        1,
        1,
        1,
        1
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/", isAuthenticated, isCreator, async function (req, res, next) {
  const data = req.body;
  try {
    if (!data.school_id || !data.name || !data.description || !data.category) {
      next(
        new BadRequestError(
          "missing required fields school_id, name, description, category"
        )
      );
      return;
    }

    const result = await upsertClass(
      data.id || null,
      data.school_id || GENERAL_SCHOOL_ID,
      data.name,
      data.description,
      data.category,
      req.user
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

//shcool table stuff
router.get("/school/all", async function (req, res, next) {
  try {
    const result = await getSchools();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
