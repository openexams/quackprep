import { standardApiCall } from '@utils/api';
import { updateArrWithNewVals } from '@utils/functions';
import { createSelector } from 'reselect';
import { deleteGroupById, getGroupsByUserId, upsertGroup } from '../groupSlice';

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
  return deleteGroupById(id, DELETE_TOPIC); //TODO
}

export function upsertTopic(id, name, class_id, desc) {
  return upsertGroup(id, name, class_id, 'topic', desc, UPSERT_TOPIC);
}

const DEFAULT_STATE = {
  topics: null,
};

export default function topicReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_TOPICS: // something to map topics in just in case same topics are grabbed twice.
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
