import { standardApiCall } from '@utils/api';
import { createSelector } from 'reselect';
import { deleteGroupById, getGroupsByUserId, upsertGroup } from '../groupSlice';
import { updateArrObjectsWithNewVals, filterArr, upsertArray, countingSort } from 'maddox-js-funcs';

const GET_TOPICS = 'app/class/topic/GET_TOPICS';
const DELETE_TOPIC = 'app/class/topic/DELETE_TOPIC';
const UPSERT_TOPIC = 'app/class/topic/UPSERT_TOPIC';

export function getTopicsByClassId(classId) {
  //console.log('getting topics by clas id', classId);
  return standardApiCall('get', `/api/group/topic/${classId}`, null, GET_TOPICS, 'TopicsShow');
}

export function getTopicsByUserId() {
  return getGroupsByUserId('topic', GET_TOPICS);
}
export function deleteTopicById(id) {
  return deleteGroupById(id, DELETE_TOPIC);
}

export function upsertTopic(id, name, class_id, desc) {
  return upsertGroup(id, name, class_id, 'topic', desc, UPSERT_TOPIC);
}

const DEFAULT_STATE = {
  topics: null,
};

export default function topicReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_TOPICS:
      return {
        ...state,
        topics: countingSort(updateArrObjectsWithNewVals(state.topics, action.payload), 'class_id'),
      };
    case DELETE_TOPIC:
      return { ...state, topics: filterArr(state.topics, action.payload) };
    case UPSERT_TOPIC:
      return { ...state, topics: upsertArray(state.topics, action.payload?.[0]) };
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
