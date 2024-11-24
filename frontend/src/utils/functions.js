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
export function deepCopyObject(item) {
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
import { selectMutlipleBinarySearch } from '../../../shared/globalFuncs';

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
      if (isNaN(id)) {
        parseInt(id);
      }
      let tmp = [];
      for (let i = 0; i < stateArr.length; i++) {
        if (stateArr[i][idName] === id) {
          tmp.push(stateArr[i]);
        }
      }
      return tmp;
    },
  );
}

/**
 *
 * @param {String} path ex app.home.userCount
 * @param {String} idName ex class_id
 * @param {int} id
 * @returns array at that position only with the matching id objects
 */
export function selectBINARYArrayOfStateById(path, idName, id) {
  // make a function that takes in the state and the path and finds the state at that path or returns null.
  return createSelector(
    (state) => state,
    function (state) {
      const stateArr = sendObjToPath(state, path);
      if (!Array.isArray(stateArr)) {
        //console.count('no state found');
        return null;
      }
      if (!path || !idName || !id) {
        return null;
      }
      id = parseInt(id);

      return selectMutlipleBinarySearch(stateArr, idName, id);
    },
  );
}

export function selectArrayOfStateByGroupId(path, id) {
  // make a function that takes in the state and the path and finds the state at that path or returns null.
  return createSelector(
    (state) => state,
    function (state) {
      const stateArr = sendObjToPath(state, path);
      if (!stateArr) {
        //console.count('no state found');
        return null;
      }
      if (!path || !id) {
        return null;
      }
      if (!isNaN(id)) {
        parseInt(id);
      }
      let tmp = [];
      for (let i = 0; i < stateArr.length; i++) {
        for (let j = 0; j < stateArr[i]?.group_id?.length; j++) {
          if (stateArr[i]?.group_id[j] === id) {
            tmp.push(stateArr[i]);
            break; // we can add this so go next
          }
        }
      }
      return tmp;
    },
  );
}

// pls pass in two objs with same keys TODO TEST
export function checkEquivalenceOfObjects(obj1, obj2) {
  if (!obj1 || !obj2) return false;
  let o1keys = Object.keys(obj1);
  for (let i = 0; i < o1keys.length; i++) {
    if (obj1[o1keys[i]] == obj2[o1keys[i]]) {
    } else {
      //console.log(obj1, 'and ', obj2, ' are not equal');
      return false;
    }
  }
  return true;
}

/**
 * if what you are trying to add (a arr of obj) id is the same as it was before then dont add it.
 *
 * only checks id not equivalence
 * @param {Array} old
 * @param {Array} newA
 * @returns {Array}
 */
export function updateArrObjectsWithNewVals(old, newA) {
  const map = {};
  if (old) {
    for (let i = 0; i < old.length; i++) {
      map[old[i].id] = old[i];
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
  if (!array || !needles || !keyNamesToCheck || !returnKeyWanted) {
    return null;
  }
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

/**
 *
 * @param {Array} array
 * @param {*} objectKeyToCheck
 * @param {String} including
 */
export function selectArrayOfIncludingItem(array, objectKeyToCheck, including) {
  if (including === '' || objectKeyToCheck === '' || array?.length === 0 || !array) {
    return array;
  }
  let ret = [];
  for (let i = 0; i < array.length; i++) {
    if (String(array[i]?.[objectKeyToCheck])?.toLowerCase()?.includes(including?.toLowerCase())) {
      ret.push(array[i]);
    }
  }
  return ret;
}

/**
 * casts everything to a string and calls includes
 * @param {Array} array
 * @param {Array} keysToCheck
 * @param {Array} valuesIncluded
 */
export function selectArrayOfIncludingItems(array, keysToCheck, valuesIncluded) {
  // todo if im trying to pull in question 430 it will pull in question 43, 30, and 430
  if (!Array.isArray(array) || keysToCheck == null) {
    return array;
  }

  let canRetEarly = true;
  for (let i = 0; i < keysToCheck?.length; i++) {
    if (valuesIncluded[i] == '' || valuesIncluded[i] == null) {
    } else {
      canRetEarly = false;
    }
  }
  if (canRetEarly) {
    return array;
  }

  let ret = [];
  for (let i = 0; i < array.length; i++) {
    let canAdd = true;
    for (let j = 0; j < keysToCheck.length; j++) {
      // go through keys
      if (
        valuesIncluded[j] === '' ||
        String(array[i]?.[keysToCheck[j]])?.toLowerCase()?.includes(valuesIncluded[j]?.toLowerCase())
      ) {
      } else {
        canAdd = false;
      }
    }
    if (canAdd) {
      ret.push(array[i]);
    }
  }
  return ret;
}

/**
 * unoptimal because of how state works
 * You pass in the id of the object u want to remove from the array
 * @param {Array<Object>} arr
 * @param {Int} id must be in the array which is a array of objects
 * @returns
 */
export function filterArr(arr, id) {
  if (!Array.isArray(arr) || !id) {
    return [];
  }
  let ret = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?.id !== id) {
      ret.push(deepCopyObject(arr[i]));
    }
  }

  return ret;
}

/**
 * Operates on .id
 * Handles Creation of new obj and editing of object BY ID
 *
 *  ADDS NEW ITEM TO THE END
 * @param {Array} arr
 * @param {*} obj
 * @returns {Array} updated arr
 */
export function upsertArray(arr, obj) {
  if (!Array.isArray(arr) || !obj) {
    return [];
  }
  let ret = [];
  if (arr.length === 0) {
    ret.push(obj);
    return ret;
  }
  let added = false;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?.id !== obj.id) {
      ret.push(arr[i]);
    } else {
      ret.push(obj);
      added = true;
    }
  }
  if (added === false) {
    ret.push(obj);
  }

  return ret;
}

export function copyArray(arr) {
  if (!Array.isArray(arr)) {
    return [];
  }
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    newArr.push(arr[i]);
  }
  return newArr;
}

/**
 * Adds key, value is amt of times you have tried to update it
 * @param {Object} map
 * @param {*} key
 */
export function updateObjectWithKey(map, key) {
  map = deepCopyObject(map);
  if (map[key] === undefined) {
    map[key] = 1;
  } else {
    map[key]++;
  }
  return map;
}

export function isKeyInObject(object, key) {
  if (object[key] !== undefined) {
    return true;
  }
  return false;
}

/**
 * Values will be overwritten
 * @param {Object} objects
 * @param {Array} keys
 */
export function updateObjectWithFirstKeyNotInObject(object, keys) {
  if (!keys || !object) {
    return object;
  }
  object = deepCopyObject(object);
  for (let i = 0; i < keys.length; i++) {
    if (object[keys[i]] !== undefined) {
      object[keys[i]]++;
      continue;
    } else {
      object[keys[i]] = 1;
      break;
    }
  }
  return object;
}
