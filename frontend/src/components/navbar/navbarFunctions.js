import { getClassesBySchoolId } from '@src/app/class/classSlice';
import { getSchools } from '@src/app/class/school/schoolSlice';
import { getQuestionsByGroupId } from '@src/app/class/question/questionSlice';
import { getChoicesByGroup } from '@src/app/class/question/choices/choicesSlice';
import { getFixedUrlArr, updateCurrentClassData, updateCurrentGroupData, updateQuestionId, updateSchoolId } from './navbarSlice';
import { findNeedleInArrayOfObjectsLINEAR, findNeedlesInArrayOfObjectsLINEAR } from 'maddox-js-funcs';
import { getPdfsByClassId } from '@src/app/class/group/pdf/pdfSlice';
import { getGroupsByClassId } from '@src/app/class/group/groupSlice';

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
  const urlArr = getFixedUrlArr(url);
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

export function classUpdateLogic(dispatch, classes, class_id, school_id) {
  const curClass = findNeedlesInArrayOfObjectsLINEAR(classes, ['id', 'school_id'], [class_id, school_id]);
  if (curClass) {
    dispatch(updateCurrentClassData({ name: curClass?.name, id: curClass?.id }));
  } else {
    console.log('class not found');
  }
}

// fetches all schools
export function schoolFetchLogic(dispatch) {
  dispatch(getSchools());
}

export function schoolUpdateLogic(dispatch, schools, school_name) {
  const school = findNeedleInArrayOfObjectsLINEAR(schools, 'school_name', school_name);
  if (school?.id) {
    dispatch(updateSchoolId(school?.id));
  }
}

export function groupUpdateLogic(dispatch, groupId, class_id, groups) {
  const currentGroup = findNeedlesInArrayOfObjectsLINEAR(groups, ['class_id', 'id'], [class_id, groupId]);

  if (currentGroup) {
    dispatch(updateCurrentGroupData({ id: currentGroup?.id, name: currentGroup?.name }));
  }
}

export function groupFetchLogic(dispatch, classId) {
  if (classId) {
    dispatch(getGroupsByClassId(classId));
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
