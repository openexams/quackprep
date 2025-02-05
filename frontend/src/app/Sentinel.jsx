import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { firstLetterUppercase } from '@utils/helperFuncs';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@app/auth/authSlice';
import { getFixedUrlArr, selectNavbarState, upsertTimeSpent, updateGroupType } from '@app/layout/navbar/navbarSlice';

import { selectClassState } from '@app/class/classSlice';
import { selectSchoolState } from '@app/class/school/schoolSlice';
import { selectLoadingState } from '@app/store/loadingSlice';
import { select401CompState } from '@components/401/401Slice';

import { selectGroupsState } from '@app/class/group/groupSlice';
import {
  pdfsFetchLogic,
  schoolUpdateLogic,
  choicesFetchLogic,
  classFetchLogic,
  classUpdateLogic,
  questionFetchLogic,
  questionUpdateLogic,
  groupFetchLogic,
  groupUpdateLogic,
} from './fetchFunction';
import { blogs } from './blog/blogs';
import Blog from './blog/Blog';

export default function Sentinel() {
  const {
    page: activePage,
    className,
    classId,
    groupName,
    groupId,
    questionId,
    schoolName,
    groupType,
    schoolId,
  } = useSelector(selectNavbarState).navbar;
  const dispatch = useDispatch();
  const user = useSelector(selectUser).user;
  const userIdRef = useRef(user.id);
  const schools = useSelector(selectSchoolState);
  const loading = useSelector(selectLoadingState)?.loadingComps;
  const State401 = useSelector(select401CompState).show;
  const pathArray = getFixedUrlArr(activePage);
  const location = useLocation();
  const classes = useSelector(selectClassState);
  const groups = useSelector(selectGroupsState);

  useEffect(() => {
    const urlArr = getFixedUrlArr(location.pathname);
    if (urlArr[1] === 'blog' && urlArr[2]) {
      document.title = Blog.getBlogFromLink(blogs, urlArr[2])?.getTitle() || '404 Blog - Quackprep';
    } else if (schoolName) {
      document.title = schoolName + ' - ' + 'Quackprep';
    } else if (urlArr[1]) {
      document.title = firstLetterUppercase(urlArr[1]) + ' - ' + 'Quackprep';
    } else {
      document.title = 'QuackPrep | Past Exams | AI Study Tools';
    }
  }, [location, schoolName]);

  useEffect(() => {
    userIdRef.current = user.id;
  }, [user.id]); // keep userIdRef.current up to date with user.id

  useEffect(() => {
    const interval = setInterval(() => {
      if (userIdRef.current) {
        // cant use user.id here as it takes the user.id value and saves it for every callm, while useRef.current is a pointer to the value ( thats how I like to think ab it )
        dispatch(upsertTimeSpent()); // TODO TEST
      }
    }, 300000); // runs every 5 minute

    return () => clearInterval(interval);
  }, []);

  ///  USE EFFECTS FOR KEEPING STORE SAME AS URL ///
  useEffect(() => {
    if (pathArray?.[1]?.includes('class') && !activePage?.includes('/auth?next') && !State401) {
      if (pathArray?.[4] && className && classId) {
        dispatch(updateGroupType(pathArray[4]));
      }
      if (!loading?.SchoolsList) {
        schoolUpdateLogic(dispatch, schools, schoolName);
      }
      if (!loading?.ClassList && schoolId && schoolName) {
        classFetchLogic(dispatch, classes, schoolId);
        classUpdateLogic(dispatch, classes, classId, schoolId);
      }
      if (pathArray?.[4] === 'pdfexams' && !loading?.PDFList && classId && schoolId && schoolName && className) {
        pdfsFetchLogic(dispatch, classId);
      }

      if (pathArray?.[4] === 'group' && !loading?.GroupsList && classId && className && schoolId && schoolName) {
        groupUpdateLogic(dispatch, groupId, classId, groups);
        groupFetchLogic(dispatch, classId);
      }
      if (
        pathArray?.[4] === 'group' &&
        pathArray?.[6] === 'question' &&
        !loading?.QuestionPage &&
        classId &&
        groupId &&
        groupName &&
        groupType &&
        schoolId &&
        schoolName
      ) {
        questionUpdateLogic(dispatch, questionId);
        questionFetchLogic(dispatch, groupId);
      }
      if (
        pathArray?.[4] === 'group' &&
        pathArray?.[6] === 'question' &&
        !loading?.ChoiceRouter &&
        className &&
        classId &&
        groupId &&
        groupName &&
        groupType
      ) {
        choicesFetchLogic(dispatch, groupId);
      }
    }
  }, [
    activePage,
    classId,
    className,
    groups,
    groupId,
    groupType,
    groupName,
    classes,
    schoolName,
    schools,
    schoolId,
    questionId,
    loading?.GroupsList,
    loading?.ClassList,
    loading?.QuestionPage,
    loading?.ChoiceRouter,
    loading?.PdfList,
    loading?.PDFList,
    loading?.SchoolsList,
  ]);

  return null;
}
