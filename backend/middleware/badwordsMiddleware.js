import { commonErrorMessage } from "#utils/utils.js";
import {
  RegExpMatcher,
  englishDataset,
  resolveConfusablesTransformer,
  skipNonAlphabeticTransformer,
  collapseDuplicatesTransformer,
} from "obscenity";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  // ...englishRecommendedTransformers,
  blacklistMatcherTransformers: [
    resolveConfusablesTransformer(), // '🅰' => 'a'
    // resolveLeetSpeakTransformer(), // '$' => 's'
    skipNonAlphabeticTransformer(), // 'f.u...c.k' => 'fuck'
    collapseDuplicatesTransformer(), // 'aaaa' => 'a'
  ],
});
/**
 * Checks all fields of this object (not deeply) for bad words
 * @param {Object} obj
 * @returns {Boolean} true if bad word false if not
 */
export function checkAllFieldsForBadWords(obj) {
  const paramsArray = Object.keys(obj);
  for (let i = 0; i < paramsArray.length; i++) {
    if (matcher.hasMatch(String(obj[paramsArray[i]]))) {
      /**@type {import("obscenity").MatchPayload[]} */
      const matchedWord = matcher.getAllMatches(String(obj[paramsArray[i]]));
      dlog(
        `Bad word found between: ${matchedWord[0].startIndex} - ${matchedWord[0].endIndex}`
      );
      return true;
    }
  }
  return false;
}
/**
 * Express Middleware. Only Checks On POST PUT & PATCH requests
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} next
 * @returns
 */
export function checkForBadWords(req, res, next) {
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
