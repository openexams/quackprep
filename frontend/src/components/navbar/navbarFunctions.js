import { getClassesBySchoolId } from '@src/app/class/classSlice';
import { getSchools } from '@src/app/class/school/schoolSlice';
import { getTopicsByClassId } from '@src/app/class/group/topic/topicSlice';
import { getExamsByClassId } from '@src/app/class/group/exam/examSlice';
import { getQuestionsByGroupId } from '@src/app/class/question/questionSlice';
import { getChoicesByGroup } from '@src/app/class/question/choices/choicesSlice';
import { updateCurrentClassData, updateCurrentGroupData, updateQuestionId, updateSchoolId } from './navbarSlice';
import { findNeedleInArrayOfObjectsLINEAR, findNeedlesInArrayOfObjectsLINEAR } from 'maddox-js-funcs';
import { getPdfsByClassId } from '@src/app/class/group/pdf/pdfSlice';

/**
 * Returns all possible page permuations with the given url
 * @param {String} url
 * @returns {Array<String>}
 */
export function parseUrlIntoPages(url) {
  if (!url) {
    return null;
  }
  // [0] is always "" (blank)
  const urlArr = url.split('/');
  let total = [];
  // i is off by one so i can be used by slice
  for (let i = 2; i < urlArr.length + 1; i++) {
    const curStr = urlArr.slice(0, i).join('/');

    total.push(curStr);
    if (curStr.includes('/question')) {
      break; // means we got all questions & choices
    }
  }
  return total;
}

/**
 *
 * @param {String} word
 * @returns {Boolean}
 */
export function doesWordContainNavbarKeyword(word) {
  if (!word) {
    return false;
  }
  if (
    word.includes('class') ||
    word.includes('topic') ||
    word.includes('exam') ||
    word.includes('question') ||
    word.includes('choice')
  ) {
    return true;
  }
  return false;
}

export function pdfsFetchLogic(dispatch, class_id) {
  if (class_id) {
    dispatch(getPdfsByClassId(class_id));
  }
}

export function classFetchLogic(dispatch, classes, schoolId) {
  dispatch(getClassesBySchoolId(schoolId));
}

export function classUpdateLogic(dispatch, classes, curClassName, school_id) {
  const tmp_c_id = findNeedlesInArrayOfObjectsLINEAR(classes, ['name', 'school_id'], [curClassName, school_id], 'id');
  dispatch(updateCurrentClassData({ name: curClassName, id: tmp_c_id }));
}

// fetches all schools
export function schoolFetchLogic(dispatch) {
  dispatch(getSchools());
}

export function schoolUpdateLogic(dispatch, schools, school_name) {
  const schoolId = findNeedleInArrayOfObjectsLINEAR(schools, 'school_name', school_name, 'id');
  if (schoolId) {
    dispatch(updateSchoolId(schoolId));
  }
}

export function topicUpdateLogic(dispatch, groupName, class_id, topics) {
  const tmp_topic_id = findNeedlesInArrayOfObjectsLINEAR(topics, ['name', 'class_id'], [groupName, class_id], 'id');
  if ((tmp_topic_id, groupName)) {
    dispatch(updateCurrentGroupData({ name: groupName, id: tmp_topic_id }));
  }
}

export function topicFetchLogic(dispatch, classId) {
  if (classId) {
    dispatch(getTopicsByClassId(classId));
  }
}

export function examUpdateLogic(dispatch, groupName, class_id, exams) {
  const current_exam_id = findNeedlesInArrayOfObjectsLINEAR(exams, ['class_id', 'name'], [class_id, groupName], 'id');
  if (groupName && current_exam_id) {
    dispatch(updateCurrentGroupData({ id: current_exam_id, name: groupName }));
  }
}

export function examFetchLogic(dispatch, classId) {
  if (classId) {
    dispatch(getExamsByClassId(classId));
  }
}

export function questionUpdateLogic(dispatch, question_id) {
  if (question_id) {
    dispatch(updateQuestionId(parseInt(question_id)));
  }
}

export function questionFetchLogic(dispatch, groupId) {
  if (groupId) {
    dispatch(getQuestionsByGroupId(groupId));
  }
}

export function choicesFetchLogic(dispatch, groupId) {
  if (groupId) {
    dispatch(getChoicesByGroup(groupId));
  }
}
