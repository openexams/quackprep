import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import { commonErrorMessage } from "#utils/utils.js";
import { parsePdfIntoGroup } from "#models/group/ai/index.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); // Store files in memory

router.post(
  "/",
  isAuthenticated,
  upload.single("file"),
  async function (req, res) {
    try {
      const file = req.file;
      const class_id = req.body.class_id;
      const prompt = req.body.prompt;

      if (!file || !class_id) {
        commonErrorMessage(
          res,
          400,
          `missing required fields: need file and class_id`
        );
        return;
      }

      // Process file (stored in memory or temporary location)
      const result = await parsePdfIntoGroup(file, class_id, req.user, prompt);
      res.status(201).json(result);
    } catch (error) {
      commonErrorMessage(
        res,
        500,
        `failed to generate ai group in class ${req.fields?.class_id}`,
        error
      );
    }
  }
);

export default router;
