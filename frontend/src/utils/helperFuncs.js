/**
 * Text len must be >=2
 * @param {String} text
 * @returns
 */
export function firstLetterUppercase(text) {
  if (!text) {
    return null;
  }
  let tmp = text[0].toUpperCase();
  return tmp + text.slice(1);
}
