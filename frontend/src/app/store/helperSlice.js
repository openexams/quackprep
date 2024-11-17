import { filterArr, updateArrWithNewVals, upsertArray } from '@utils/functions';

export function defaultCRUDReducer(state, action, stateKey, originalStateArr) {
  if (action.type?.includes('GET')) {
    return { ...state, [stateKey]: updateArrWithNewVals(originalStateArr, action.payload) };
  } else if (action.type?.includes('UPSERT')) {
    return { ...state, [stateKey]: upsertArray(originalStateArr, action.payload?.[0]) };
  } else if (action.type?.includes('DELETE')) {
    return { ...state, [stateKey]: filterArr(originalStateArr, action.payload) };
  } else {
    return state;
  }
}
