import { isAuthenticated } from "#middleware/authMiddleware.js";
import { isCreator } from "#middleware/creatorMiddleware.js";
import {
  upsertClass,
  getClassesBySchoolId,
  getClassesByUserId,
  getSchools,
  getClassCategories,
} from "#models/class/index.js";
import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import { commonErrorMessage } from "#utils/utils.js";
import express from "express";
const router = express.Router();

router.get("/user", isAuthenticated, async function (req, res) {
  try {
    const result = await getClassesByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `server error could not get classes by user id ${req.user}`,
    });
  }
});

router.get("/categories", async function (req, res) {
  try {
    const result = await getClassCategories();
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to get all class categories", error);
  }
});

router.get("/:school_id", async function (req, res) {
  try {
    const result = await getClassesBySchoolId(req.params.school_id);
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to get all classes by school id ${req.params.school_id}`,
      error
    );
  }
});

router.delete(
  "/:class_id",
  isAuthenticated,
  isCreator,
  async function (req, res) {
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
      commonErrorMessage(
        res,
        500,
        `failed to delete class ${req.params.class_id}`,
        error
      );
    }
  }
);

router.post("/", isAuthenticated, isCreator, async function (req, res) {
  const data = req.body;
  try {
    if (!data.school_id || !data.name || !data.description || !data.category) {
      commonErrorMessage(
        res,
        400,
        "missing required fields school_id, name, description, category"
      );
      return;
    }

    const result = await upsertClass(
      data.id || null,
      data.school_id,
      data.name,
      data.description,
      data.category,
      req.user
    );
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to add class", error);
  }
});

//shcool table stuff
router.get("/school/all", async function (req, res) {
  try {
    const result = await getSchools();
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to get all schools", error);
  }
});

export default router;
