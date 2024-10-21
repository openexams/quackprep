/**
 *
 * @param {String} given will be used with new Date(given)
 */
export function curTimeUTCMinusGiven(given) {
  // testable
  const diff = (new Date().getTime() - new Date(given)) / 86400000;
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
    semester: examNameString[0],
    year: examNameString[1],
    exam_num: examNameString[2],
  };
}
