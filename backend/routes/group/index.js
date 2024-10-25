import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  getGroupIdByClassNameAndGroupName,
  getGroupsByClassId,
} from "#models/group/index.js";

const router = express.Router();
router.use(isAuthenticated);

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

export default router;
