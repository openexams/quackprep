// https://mathpix.com/pricing
import { MATHPIX_API_INFO } from "#config/config.js";
import axios from "axios";
import { sleep } from "#utils/utils.js";
import {
  MATHPIX_API_PDF_GET_RESULT_RETRIES,
  MATHPIX_API_PDF_GET_RESULT_SLEEP_TIME_MS,
} from "../../constants.js";

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
  try {
    if (retries > MATHPIX_API_PDF_GET_RESULT_RETRIES) {
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
      dlog("successfully got pdf by pdf_id");
      return mmd.data;
    } else if (result.data?.status === "error") {
      throw new Error("failed to get pdf by pdf_id. status is error");
    } else {
      dlog("status not completed. retrying in 10 seconds");
      await sleep(MATHPIX_API_PDF_GET_RESULT_SLEEP_TIME_MS); // wait 10 second
      return getFormattedPdfByPdfIdMathpix(pdf_id, format, retries + 1);
    }
  } catch (e) {
    console.error(e); // i think since its recursive it will throw the error retries times.
    throw e;
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

/**
 * post pdf to mathpix and get formatted pdf
 * @param {*} formData formdata.set("file", file) then add it here
 * @returns {String} formatted pdf
 */
export async function postPdfAndRetriveParsedPdf(formData) {
  const pdf_id = await postPDFToMathpix(formData);
  dlog("waiting 10s then getting pdf");
  await sleep(10000);
  return await getFormattedPdfByPdfIdMathpix(pdf_id);
}

/**
 * post image to mathpix and get text
 * @param {File} file file opened with fs.readFileSync
 * @returns {String} text
 */
export async function postImageAndRecieveText(file) {
  try {
    // formData.append(
    //   "options_json",
    //   JSON.stringify({
    //     math_inline_delimiters: ["$$", "$$"],
    //     rm_spaces: true,
    //   })
    // );
    const result = await axios.post(
      "https://api.mathpix.com/v3/text",
      {
        src: `data:image/${file.type};base64,` + file.toString("base64"),
        options: { math_inline_delimiters: ["$$", "$$"], rm_spaces: true }, // this part does not wrap latex in $$, so no work
      },
      {
        headers: {
          // ...formData.getHeaders(),
          app_id: MATHPIX_API_INFO.MATHPIX_APP_ID,
          app_key: MATHPIX_API_INFO.MATHPIX_API_KEY,
          // "Content-type": "multipart/form-data",
        },
      }
    );

    if (!result.data?.text) {
      dlog(result.data);
      throw new Error("failed to get text from image, mathpix error.");
    }
    dlog(`successfully got text from image with status ${result.status}`);
    return result.data?.text;
  } catch (e) {
    console.error("error in postImageAndRecieveText", e);
    throw e;
  }
}
