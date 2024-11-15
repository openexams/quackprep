import { isAuthenticated } from "#middleware/authMiddleware.js";
import { isCreator } from "#middleware/creatorMiddleware.js";
import {
  upsertClass,
  getClasses,
  getClassesByUserId,
  getClassIdByClassName,
  getSchools,
} from "#models/class/index.js";
import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import express from "express";
const router = express.Router();

router.use(isAuthenticated);

router.get("/", async function (req, res) {
  try {
    const result = await getClasses();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "server error could not get classes" });
  }
});

router.get("/user", async function (req, res) {
  try {
    const result = await getClassesByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `server error could not get classes by user id ${req.user}`,
    });
  }
});

router.delete("/:class_id", async function (req, res) {
  try {
    const class_id = parseInt(req.params.class_id);
    const result = await cascadeSetDeleted(
      req.user,
      "class",
      class_id,
      1,
      1,
      1,
      1
    );
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: `failed to delete class by id ${req.params.class_id}` });
  }
});

router.post("/", isCreator, async function (req, res) {
  const data = req.body;
  try {
    if (!data.school_id || !data.name || !data.description || !data.category) {
      res.status(400).json({ message: `pls provide all needed values ` });
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
    res.status(500).json({
      message: `server error could not create class with user id ${req.user}`,
    });
  }
});

router.get("/:className", async function (req, res) {
  try {
    const result = await getClassIdByClassName(req.params.className);

    res.status(200).json(result?.[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "server error could not get classes by classname" });
  }
});

//shcool table stuff
router.get("/school/all", async function (req, res) {
  try {
    const result = await getSchools();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "failed to get all schools" });
  }
});

export default router;
