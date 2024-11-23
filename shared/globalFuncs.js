import Rand, { PRNG } from "rand-seed";

/**
 *
 * @param {String} given will be used with new Date(given)
 */
export function curTimeUTCMinusGiven(given) {
  // testable
  const diff = Math.abs(new Date().getTime() - new Date(given)) / 86400000;
  if (diff < 0) {
    return 0;
  } else {
    return diff;
  }
}

export class Streak {
  timeSince = null;
  constructor(last_claim) {
    this.timeSince = curTimeUTCMinusGiven(last_claim);
  }

  hasStreak() {
    if (this.timeSince == null) {
      return true;
    }
    if (this.timeSince > 2) {
      return false;
    }
    return true;
  }
  canClaimStreak() {
    if (this.timeSince == null) {
      return true;
    }
    if (this.timeSince > 1) {
      return true;
    }
    return false;
  }
}

/**
 * ${exam.semester}_${exam.year}_${exam.exam_num}
 * @param {String} examNameString
 */
export function parseExamNameId(examNameString) {
  examNameString = examNameString.split("_");
  return {
    semester: examNameString?.[0],
    year: examNameString?.[1],
    exam_num: examNameString?.[2],
  };
}

/**
 *
 * @param {String} string
 */
export function replaceP20WithSpace(string) {
  if (!string) {
    return null;
  }
  if (string.includes("%20")) {
    // optimize
    return string.replace(/%20/g, " ");
  } else {
    return string;
  }
}

/**
 * randomizes a arrays values TODO TEST
 * @param {Array} array array to be randomized
 * @returns {Array} randomized array
 */
export function randomizeArray(array, seed) {
  if (!array) {
    return null;
  }
  const rand = new Rand(seed); // TODO TEST SHOULD GENERATE SAME RANDOM NUMBER EVERY TIME

  const length = array.length;
  let newArr = [];
  for (let i = 0; i < length; i++) {
    const curLength = array.length;
    const randomIndex = Math.floor(rand.next() * curLength);
    newArr.push(array[randomIndex]);
    array = [
      ...array.slice(0, randomIndex),
      ...array.slice(randomIndex + 1, length),
    ];
  }
  return newArr;
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
    if (keys[i] !== "type_name" && obj1[keys[i]] === obj2[keys[i]]) {
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
        accumulated_object = checkObjectDifferenceAndMerge(
          dataCopy[i],
          dataCopy[j]
        );
        dataCopy[i] = accumulated_object;
      } else {
        break;
      }
    }
    updated_arr.push(accumulated_object);
  }
  return updated_arr;
}

/**
 * Find item, then accumulate. Item MUST be sorted by the needleName key.
 *
 * @param {Array<Object>} haystack your haystack must an arr of objects where the needleName holds a value which is compareable.
 * @param {String} needleName
 * @param {*} needle must be compareable
 */
export function selectMutlipleBinarySearch(haystack, needleName, needle) {
  if (
    !Array.isArray(haystack) ||
    !needleName ||
    !needle ||
    !haystack.length >= 1
  ) {
    console.log("passed in bad values");
    return [];
  }
  let left = 0;
  let right = haystack.length - 1;
  let middle;
  let found_index = -1;
  // trying to find a item that has the correct needle and the item before it does NOT have the correct needle.
  while (true) {
    middle = Math.floor((right + left) / 2);
    if (haystack[middle][needleName] === needle) {
      found_index = middle;
      break;
    }
    if (right <= left) {
      return []; // not found
    }

    if (haystack[middle][needleName] === needle) {
      found_index = middle;
      break; //watta we wanna
    } else if (needle > haystack[middle][needleName]) {
      left = middle + 1; // go right
    } else if (needle < haystack[middle][needleName]) {
      right = middle - 1; // go left
    } else {
      console.error(
        "i did not account for this case fatal error selectMutlipleBinarySearch"
      );
    }
  }

  // we found a index we want, now backtrack to first item (backtracks to 0 or first item)
  let start = 0;
  for (let i = found_index; i > 0; i--) {
    if (
      haystack[i][needleName] === needle &&
      haystack[i - 1][needleName] !== needle
    ) {
      start = i;
      break;
    }
  }
  // now accumulate correct items
  let ret = [];
  for (let i = start; i < haystack.length; i++) {
    if (haystack[i][needleName] !== needle) {
      break;
    }
    ret.push(haystack[i]);
  }
  return ret;
}

export function findMaxValue(arr, keyToCheck) {
  let max = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?.[keyToCheck] > max) max = arr[i]?.[keyToCheck];
  }
  return max;
}

// i made on in python that is intuitive and is also stable and I think its faster.
export function countingSort(arr, sortBy) {
  if (!Array.isArray(arr) || !sortBy || arr.length <= 0) {
    return [];
  }
  const count = new Array(findMaxValue(arr, sortBy) + 1).fill(0);
  for (let i = 0; i < arr.length; i++) {
    count[arr[i][sortBy]]++;
  }

  for (let i = 1; i < count.length; i++) {
    count[i] = count[i] + count[i - 1]; //  transforms the count array into an array of positions
  }
  const ret = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    ret[count[arr[i][sortBy]] - 1] = arr[i];
    count[arr[i][sortBy]]--;
  }
  return ret;
}
