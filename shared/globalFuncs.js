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
