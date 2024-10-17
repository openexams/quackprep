/**
 *
 * @param {Array<Object>} arr array to copy
 * @returns {Array<Object>} copy of array u give
 */
export function deepCopyArrayOfObjects(arr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    newArr.push({ ...arr[i] });
  }

  return newArr;
}

/**
 *
 * @param {JSON} item item to copy must be a json object
 * @returns {JSON} copy of array u give
 */
export function deepCopy(item) {
  return JSON.parse(JSON.stringify(item));
}

/**
 * Bubble Sort uhhh
 * @param {Array<Object>} arr
 * @returns {Array<Object>} deep copy of the array you give sorted from least to greatest by priority
 */
export function orderArrayOfObjectsByPriority(arr) {
  const newArr = deepCopyArrayOfObjects(arr);
  for (let i = 0; i < newArr.length; i++) {
    for (let j = 0; j < newArr.length - 1 - i; j++) {
      if (newArr[j].priority > newArr[j + 1].priority) {
        const tmp = newArr[j];
        newArr[j] = newArr[j + 1];
        newArr[j + 1] = tmp;
      }
    }
  }
  return newArr;
}

/**
 * Date 1 will be subtracted by date 2
 * @param {String} date1
 * @param {String} date2
 * @returns {Number} difference in days between date1 and 2
 */
export function getDateDiffInDays(date1, date2) {
  return (new Date(date1) - new Date(date2)) / 1000 / 60 / 60 / 24;
}

/**
 *
 * @param {Object} object
 * @param {String} path ex. app.class.classes
 */
export function sendObjToPath(object, path) {
  const arr = path.split('.');
  for (let i = 0; i < arr.length; i++) {
    object = object[arr[i]];
  }
  return object;
}

export function turnUnderscoreIntoSpace(input) {
  let tmp = '';
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '_') {
      tmp = tmp + ' ';
    } else tmp = tmp + input[i];
  }
  return tmp;
}

import { createSelector } from 'reselect';
/**
 *
 * @param {String} path ex app.home.userCount
 * @param {String} idName ex class_id
 * @param {int} id
 * @returns array at that position only with the matching id objects
 */
export function selectArrayOfStateById(path, idName, id) {
  // make a function that takes in the state and the path and finds the state at that path or returns null.
  return createSelector(
    (state) => state,
    function (state) {
      const stateArr = sendObjToPath(state, path);
      if (!stateArr) {
        //console.count('no state found');
        return null;
      }
      if (!path || !idName || !id) {
        return null;
      }

      let tmp = [];
      for (let i = 0; i < stateArr.length; i++) {
        if (stateArr[i][idName] === parseInt(id)) {
          tmp.push(stateArr[i]);
        }
      }
      return tmp;
    },
  );
}

/**
 *
 * @param {Array} old
 * @param {Array} newA
 * @returns {Array}
 */
export function updateArrWithNewVals(old, newA) {
  const map = {};
  if (old) {
    for (let i = 0; i < old.length; i++) {
      map[old[i].id] = old[i].id;
    }
  } else {
    old = [];
  }
  let ret = [...old];
  for (let i = 0; i < newA.length; i++) {
    if (map && newA[i].id in map) {
    } else {
      ret.push(newA[i]);
    }
  }
  return ret;
}

/**
 * Finds first occurence of needle in arr does not care  1 == "1" true
 * LINEAR SEARCH
 * @param {Array} array
 * @param {Array} keyNames
 * @param {*} needle
 */
export function findNeedleInArrayOfObjectsLINEAR(array, keyName, needle, keyWanted) {
  if (!array || !needle) return null;
  for (let i = 0; i < array.length; i++) {
    if (array[i][keyName] == needle) {
      return array[i][keyWanted];
    }
  }
  return null;
}

/**
 * LINEAR SEARCH
 * @param {Array} array haystack
 * @param {Array} keyNamesToCheck ex ["name", "class_id"]
 * @param {Array} needles ex ["Test_Topic", "1"]
 * @param {Array} keyWanted key you want returned at location where it found the needle
 */
export function findNeedlesInArrayOfObjectsLINEAR(array, keyNamesToCheck, needles, returnKeyWanted) {
  if (!array || !needles || !keyNamesToCheck || !returnKeyWanted) return null;
  let both_equal = false;
  for (let i = 0; i < array.length; i++) {
    both_equal = false;
    for (let j = 0; j < keyNamesToCheck.length; j++) {
      if (array[i][keyNamesToCheck[j]] != needles[j]) {
        both_equal = false;
        break;
      } else {
        both_equal = true;
      }
    }
    if (both_equal) return array[i][returnKeyWanted];
  }
  return null;
}
