import express from "express";
import {
  getPdfsByClassId,
  upsertPdf,
  getPdfsByUserId,
} from "#models/extra/index.js";
import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import { isCreator } from "#middleware/creatorMiddleware.js";

const router = express.Router();

router.get("/pdfs/user/", async function (req, res) {
  try {
    const result = await getPdfsByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `getting pdfs by user id ${req.user} failed`,
    });
  }
});

router.get("/pdfs/:class_id", async function (req, res) {
  try {
    const result = await getPdfsByClassId(req.params.class_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `getting pdfs by class id ${req.params.class_id} failed`,
    });
  }
});

router.delete(
  "/pdfs/:pdf_id",
  isAuthenticated,
  isCreator,
  async function (req, res) {
    try {
      const result = await cascadeSetDeleted(
        // pdf only delete itself
        req.user,
        "pdf",
        req.params.pdf_id,
        0,
        0,
        0,
        0,
        1
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: `failed to delete pdf by id ${req.params.pdf_id}`,
      });
    }
  }
);

router.post("/pdfs", async function (req, res) {
  const data = req.body;
  if (!data.link || !data.class_id || !data.name) {
    res.status(400).json({
      message: `pls pass in all agrs`,
    });
    return;
  }
  try {
    const result = await upsertPdf(
      req.user,
      data.id || null,
      data.link,
      data.class_id,
      data.name
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to upsert pdf`,
    });
  }
});

export default router;
