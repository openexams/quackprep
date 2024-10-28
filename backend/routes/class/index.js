import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  getClasses,
  getClassIdByClassName,
  getSchools,
} from "#models/class/index.js";
import express from "express";
const router = express.Router();

router.use(isAuthenticated);

router.get("/", async function (req, res) {
  try {
    const result = await getClasses();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

router.get("/:className", async function (req, res) {
  try {
    const result = await getClassIdByClassName(req.params.className);

    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ message: "server error" });
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
