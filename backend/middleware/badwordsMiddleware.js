import { commonErrorMessage } from "#utils/utils.js";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

function checkAllFieldsForBadWords(obj) {
  const paramsArray = Object.keys(obj);
  for (let i = 0; i < paramsArray.length; i++) {
    if (matcher.hasMatch(String(obj[paramsArray[i]]))) {
      dlog("bad word found");
      return true;
    }
  }
  return false;
}

/**
 * Only Checks On POST PUT & PATCH requests
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} next
 * @returns
 */
export function checkForBadWords(req, res, next) {
  console.log(req.method);
  console.log(req.body);
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    if (checkAllFieldsForBadWords(req.body)) {
      return commonErrorMessage(
        res,
        400,
        "Inappropriate content detected in body"
      );
    }

    if (checkAllFieldsForBadWords(req.params)) {
      return commonErrorMessage(
        res,
        400,
        "Inappropriate content detected in params"
      );
    }
  }

  next(); // Proceed to the next middleware or route handler
}
