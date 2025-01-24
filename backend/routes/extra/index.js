// currently only used for pdfs, hopefully gone soon
import express from "express";
import {
  getPdfsByClassId,
  upsertPdf,
  getPdfsByUserId,
  getAnnouncement,
} from "#models/extra/index.js";
import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import { isCreator } from "#middleware/creatorMiddleware.js";
import { commonErrorMessage } from "#utils/utils.js";

const router = express.Router();

router.get("/announcement/", async function (req, res) {
  try {
    const result = await getAnnouncement();
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(res, 500, `failed to get announcement`, error);
  }
});

router.get("/pdfs/user/", async function (req, res) {
  try {
    const result = await getPdfsByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to get pdfs by user id ${req.user}`,
      error
    );
  }
});

router.get("/pdfs/:class_id", async function (req, res) {
  try {
    const result = await getPdfsByClassId(req.params.class_id);
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to get pdfs by class id ${req.params.class_id}`,
      error
    );
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
      commonErrorMessage(
        res,
        500,
        `failed to delete pdf by id ${req.params.pdf_id}`,
        error
      );
    }
  }
);

router.post("/pdfs", async function (req, res) {
  const data = req.body;
  if (!data.link || !data.class_id || !data.name) {
    commonErrorMessage(res, 400, `link, class_id, and name are required`);
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
    commonErrorMessage(res, 500, `failed to add pdf`, error);
  }
});

export default router;
