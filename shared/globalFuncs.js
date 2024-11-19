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
 * Merges data pulled in w multiple group ids into one
 * @param {Array} data
 * @param {String} keyName
 * @returns {Array} updated data
 */
export function mergeKeys(data, keyName) {
  if (!Array.isArray(data)) {
    return null;
  }
  data = structuredClone(data); // TODO OPTIMIZE
  let updated_arr = [];
  let tmp_groups = [];
  let j = 0;
  for (let i = 0; i < data.length; i = j) {
    tmp_groups.push(data[i]?.[keyName]);
    for (j = i + 1; j < data.length; j++) {
      if (data[i]?.id === data[j]?.id) {
        tmp_groups.push(data[j]?.[keyName]);
      } else {
        break;
      }
    }
    data[i][keyName] = tmp_groups; // group_ids diff from group_id
    updated_arr.push(data[i]);
    tmp_groups = [];
  }
  return updated_arr;
}
