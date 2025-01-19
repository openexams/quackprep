import { MATHPIX_API_INFO } from "#config/config.js";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { sleep } from "#utils/utils.js";

/**
 * Keeps retrying until conversion is completed. if it retries more than 5 times, it will throw an error
 * @param {String} pdf_id id of pdf
 * @param {void} retries do not put in here pal
 * @param {String} format .md | .mmd | .html | .docx
 * @returns {String} formatted pdf in given format
 */
export async function getFormattedPdfByPdfIdMathpix(
  pdf_id,
  format = ".md",
  retries = 0
) {
  if (retries > 5) {
    throw new Error("failed to get pdf by pdf_id. retries exceeded");
  }
  const result = await axios.get(
    `https://api.mathpix.com/v3/converter/${pdf_id}`,
    {
      headers: {
        app_id: MATHPIX_API_INFO.MATHPIX_APP_ID,
        app_key: MATHPIX_API_INFO.MATHPIX_API_KEY,
        "Content-type": "multipart/form-data",
      },
    }
  );
  if (result.data?.status === "completed") {
    const mmd = await axios.get(
      `https://api.mathpix.com/v3/pdf/${pdf_id}${format}`,
      {
        headers: {
          app_id: MATHPIX_API_INFO.MATHPIX_APP_ID,
          app_key: MATHPIX_API_INFO.MATHPIX_API_KEY,
        },
      }
    );
    return mmd.data;
  } else if (result.data?.status === "error") {
    throw new Error("failed to get pdf by pdf_id. status is error");
  } else {
    dlog("status not completed. retrying in 10 seconds");
    await sleep(10000); // wait 10 second
    return getFormattedPdfByPdfIdMathpix(pdf_id, format, retries + 1);
  }
}

/**
 *
 * @param {FormData} formData
 * @param {Number} class_id
 * @param {Number} user_id
 * @returns {String} pdf_id
 */
export async function postPDFToMathpix(formData) {
  const result = await axios.post(
    "https://api.mathpix.com/v3/pdf",
    formData,

    {
      headers: {
        ...formData.getHeaders(),
        app_id: MATHPIX_API_INFO.MATHPIX_APP_ID,
        app_key: MATHPIX_API_INFO.MATHPIX_API_KEY,
        "Content-type": "multipart/form-data",
      },
    }
  );
  if (!result.data.pdf_id) {
    throw new Error("failed to parse pdf");
  }
  return result.data.pdf_id;
}

export async function parsePdfIntoGroup(formData, class_id, user_id) {
  try {
    const pdf_id = await postPDFToMathpix(formData);
    dlog(pdf_id);
    const mmd = await getFormattedPdfByPdfIdMathpix(pdf_id);
    dlog(mmd);
  } catch (error) {
    console.error(error);
    throw error; // throw to route to handle it
  }
}

// testing
const formData = new FormData();
formData.append(
  "file",
  fs.createReadStream("./backend/models/group/ai/pd.pdf")
);

// await parsePdfIntoGroup(formData, null, null);
await getFormattedPdfByPdfIdMathpix("2025_01_19_8b28c5b960393964aa50g");
