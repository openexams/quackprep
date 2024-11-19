/**
 * Returns all possible page permuations with the given url
 * @param {String} url
 */
export function parseUrlIntoPages(url) {
  if (!url) {
    return null;
  }
  // [0] is always "" (blank)
  const urlArr = url.split('/');
  let total = [];
  // i is off by one so i can be used by slice
  for (let i = urlArr.length; i > 1; i--) {
    const curStr = urlArr.slice(0, i).join('/');
    total.push(curStr);
  }
  return total;
}
