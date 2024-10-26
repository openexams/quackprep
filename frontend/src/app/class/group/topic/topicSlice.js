import { standardApiCall } from '@utils/api';
import { updateArrWithNewVals } from '@utils/functions';
import { createSelector } from 'reselect';
const GET_TOPICS_BY_C_ID = 'app/class/topic/GET_TOPICS_BY_C_ID';

export function getTopicsByClassId(classId) {
  //console.log('getting topics by clas id', classId);
  return standardApiCall('get', `/api/group/topic/${classId}`, null, GET_TOPICS_BY_C_ID, 'TopicsShow');
}

const DEFAULT_STATE = {
  topics: null,
};

export default function topicReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_TOPICS_BY_C_ID: // something to map topics in just in case same topics are grabbed twice.
      if (state.topics) {
        return { ...state, topics: updateArrWithNewVals(state.topics, action.payload) };
      } else {
        return { ...state, topics: [...action.payload] };
      }
    default:
      return state;
  }
}

export const selectTopicState = createSelector(
  (state) => state,
  function (state) {
    return { topics: state.app.topic.topics };
  },
);
