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

/**
 * Objects must have same keys. values in object must be arrays or primitives
 * @param {*} obj1
 * @param {*} obj2
 * @returns {Object} a new objects where differences are stored in an array
 */
export function checkObjectDifferenceAndMerge(obj1, obj2) {
  const keys = Object.keys(obj1);
  const ret_obj = {};
  for (let i = 0; i < keys.length; i++) {
    // if 2 things are the same I dont want to merge them, however i need type_name to be merged no matter what lol.
    if (keys[i] !== 'type_name' && obj1[keys[i]] === obj2[keys[i]]) {
      ret_obj[keys[i]] = obj1[keys[i]];
    } else {
      let tmpArr = [];
      if (Array.isArray(obj1[keys[i]])) {
        tmpArr = [...obj1[keys[i]]];
      } else {
        tmpArr.push(obj1[keys[i]]);
      }
      if (Array.isArray(obj2[keys[i]])) {
        tmpArr = [...obj2[keys[i]]];
      } else {
        tmpArr.push(obj2[keys[i]]);
      }
      ret_obj[keys[i]] = tmpArr;
    }
  }
  return ret_obj;
}

/**
 * operates on .id
 * REQUIRES DATA TO BE SORTED BY its id prop
 * Merges data pulled in w multiple [keyName] ids into one.
 * if a row with the same id has a different object, it will create a array to house the differences.
 * @param {Array} data
 * @param {String} keyName
 * @returns {Array} updated data
 */
export function mergeData(data) {
  if (!Array.isArray(data) || data.length <= 0) {
    return null;
  }
  const dataCopy = structuredClone(data);
  let updated_arr = [];
  let accumulated_object = {};
  let j = 0;
  for (let i = 0; i < dataCopy.length; i = j) {
    accumulated_object = dataCopy[i];
    for (j = i + 1; j < dataCopy.length; j++) {
      if (dataCopy[i]?.id === dataCopy[j]?.id) {
        accumulated_object = checkObjectDifferenceAndMerge(dataCopy[i], dataCopy[j]);
        dataCopy[i] = accumulated_object;
      } else {
        break;
      }
    }
    updated_arr.push(accumulated_object);
  }
  return updated_arr;
}
