import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  getClasses,
  getClassIdByClassName,
  getSchools,
} from "#models/class/index.js";
import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import express from "express";
const router = express.Router();

// router.use(isAuthenticated); TODO!

router.get("/", async function (req, res) {
  try {
    const result = await getClasses();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "server error could not get classes" });
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

router.get("/:className", async function (req, res) {
  try {
    const result = await getClassIdByClassName(req.params.className);

    res.status(200).json(result[0]);
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
