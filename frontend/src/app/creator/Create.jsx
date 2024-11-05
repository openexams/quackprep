import { useDispatch, useSelector } from 'react-redux';
import { getClassesByUserId, selectClassState } from '../class/classSlice';
import { getTopicsByUserId, selectTopicState } from '../class/group/topic/topicSlice';
import { getExamsByUserId, selectExamsState } from '../class/group/exam/examSlice';
import { getQuestionsByUserId, selectQuestionState } from '../class/question/questionSlice';
import { getChoicesByUserId, selectChoicesState } from '../class/question/choices/choicesSlice';
import { useEffect } from 'react';
import { selectUser } from '../auth/authSlice';

export default function Create() {
  const dispatch = useDispatch();
  const classes = useSelector(selectClassState).classes;
  const topics = useSelector(selectTopicState).topics;
  const exams = useSelector(selectExamsState).exams;
  const questions = useSelector(selectQuestionState).questions;
  const choices = useSelector(selectChoicesState).choices;
  const user = useSelector(selectUser).user;

  useEffect(() => {
    if (user.id) {
      dispatch(getClassesByUserId());
      dispatch(getTopicsByUserId());
      dispatch(getExamsByUserId());
      dispatch(getQuestionsByUserId());
      dispatch(getChoicesByUserId());

      console.log('got');
    }
  }, [user?.id]);
  return <div>x</div>;
}
