import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import EditorRouter from './editor/EditorRouter';
import { getClassesByUserId, selectClassState } from '../class/classSlice';
import { getTopicsByUserId, selectTopicState } from '../class/group/topic/topicSlice';
import { getExamsByUserId, selectExamsState } from '../class/group/exam/examSlice';
import { getQuestionsByUserId, selectQuestionState } from '../class/question/questionSlice';
import { getChoicesByUserId, selectChoicesState } from '../class/question/choices/choicesSlice';
import { getClassCategories, selectClassCategories } from '../class/class_categories/classCategorySlice';
import { getSchools, selectSchoolState } from '../class/school/schoolSlice';
import { selectUser } from '../auth/authSlice';
import { show401Msg } from '@components/401/401Slice';
import { hide401Msg } from '@components/401/401Slice';
export default function Create() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser).user;
  const schools = useSelector(selectSchoolState).schools;
  const classes = useSelector(selectClassState).classes;
  const class_categories = useSelector(selectClassCategories).class_categories;
  const topics = useSelector(selectTopicState).topics;
  const exams = useSelector(selectExamsState).exams;
  const questions = useSelector(selectQuestionState).questions;
  const choices = useSelector(selectChoicesState).choices;

  useEffect(() => {
    if (user?.is_creator) {
      dispatch(hide401Msg());

      dispatch(getSchools());
      dispatch(getClassCategories());
      dispatch(getClassesByUserId());
      // dispatch(getPdfsByUserId());
      dispatch(getTopicsByUserId());
      dispatch(getExamsByUserId());
      dispatch(getQuestionsByUserId());
      dispatch(getChoicesByUserId());
    } else {
      dispatch(show401Msg());
    }
  }, [user?.is_creator]);
  if (!schools || !classes || !class_categories || !topics || !exams || !questions || !choices) {
    return <div>content not loaded</div>;
  }
  return (
    <EditorRouter
      schools={schools}
      classes={classes}
      class_categories={class_categories}
      topics={topics}
      exams={exams}
      questions={questions}
      choices={choices}
    />
  );
}
