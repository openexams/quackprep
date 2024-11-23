import { standardApiCall } from '@utils/api';
import { updateArrObjectsWithNewVals, upsertArray, filterArr } from '@utils/functions';
import { createSelector } from 'reselect';
import { mergeData } from '../../../../../shared/globalFuncs';

const GET_CRUD_QUESTIONS = 'app/class/question/GET_CRUD_QUESTIONS';
const UPSERT_CRUD_QUESTION = 'app/class/question/UPSERT_CRUD_QUESTION';
const DELETE_CRUD_QUESTION = 'app/class/question/DELETE_CRUD_QUESTION';

const POST_QUESTION_REPORT = 'app/class/question/POST_QUESTION_REPORT';

export function postQuestionReport(question_id, text) {
  return standardApiCall(
    'post',
    `/api/question/report/${question_id}`,
    { text: text },
    POST_QUESTION_REPORT,
    'QuestionPage',
    null,
    null,
    'report sent!',
  );
}

export function getQuestionsByGroupId(group_id) {
  return standardApiCall('get', `/api/question/${group_id}`, null, GET_CRUD_QUESTIONS, 'QuestionPage');
}

export function getQuestionsByUserId() {
  return standardApiCall('get', `/api/question/user`, null, GET_CRUD_QUESTIONS, 'Create');
}

/**
 *
 * @param {Int} id
 * @param {String} question
 * @param {Int} question_num_on_exam
 * @param {Array} group_ids
 * @returns
 */
export function upsertQuestionWithGroupIds(id, question, question_num_on_exam, group_ids) {
  return standardApiCall(
    'post',
    `/api/question/`,
    { id, question, question_num_on_exam, group_ids },
    UPSERT_CRUD_QUESTION,
    'Create',
  );
}

export function deleteQuestionById(id) {
  return standardApiCall('delete', `/api/question/${id}`, null, DELETE_CRUD_QUESTION, 'Create');
}

const DEFAULT_STATE = {
  questions: null,
};

// this logic is odd, pulls in question with all groups attachted, I then parse that to be an array of groups. to get the current questions topic, i also parse if the current
//group is a topic, I then show it. questions while may be duplicated on pull in, in state q.id will be unique.

export default function questionsReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case GET_CRUD_QUESTIONS: // questions are pulled in with also two different groupNames which match the 2 diff ids. the first name that will show up is the topic, and since mergeKeys saves the first key it finds, it will just show the first TOPIC name it finds for that question
      return { ...state, questions: mergeData(updateArrObjectsWithNewVals(state.questions, action.payload)) };
    case DELETE_CRUD_QUESTION:
      return { ...state, questions: filterArr(state.questions, action.payload) };
    case UPSERT_CRUD_QUESTION:
      return { ...state, questions: mergeData(upsertArray(state.questions, action.payload)) };
    default:
      return state;
  }
}

export const selectQuestionState = createSelector(
  (state) => state,
  function (state) {
    return { questions: state.app.question.questions };
  },
);
