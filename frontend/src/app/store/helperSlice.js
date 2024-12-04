import { filterArr, updateArrObjectsWithNewVals, upsertArray } from '../../../../libs/maddox-js-funcs/functions';

/**
 * DO NOT USE UNDER ANY CIRCUMSTANCE, just for refernce, cannot be used to abstract because of how redux combine reducers works
 * @param {*} state
 * @param {*} action
 * @param {*} stateKey
 * @param {*} originalStateArr
 * @returns
 */
export function defaultCRUDReducer(state, action, stateKey, originalStateArr) {
  if (action.type?.includes('GET_CRUD')) {
    return { ...state, [stateKey]: updateArrObjectsWithNewVals(originalStateArr, action.payload) };
  } else if (action.type?.includes('UPSERT_CRUD')) {
    return { ...state, [stateKey]: upsertArray(originalStateArr, action.payload?.[0]) };
  } else if (action.type?.includes('DELETE_CRUD')) {
    return { ...state, [stateKey]: filterArr(originalStateArr, action.payload) };
  } else {
    return state;
  }
}
