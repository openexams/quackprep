import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClassesByUserId, selectClassState } from '../class/classSlice';
import { getTopicsByUserId, selectTopicState } from '../class/group/topic/topicSlice';
import { getExamsByUserId, selectExamsState } from '../class/group/exam/examSlice';
import { getQuestionsByUserId, selectQuestionState } from '../class/question/questionSlice';
import { getChoicesByUserId, selectChoicesState } from '../class/question/choices/choicesSlice';
import { useEffect } from 'react';
import { selectUser } from '../auth/authSlice';
import { selectLoadingState } from '../store/loadingSlice';
import { Accordion, Segment, Container, Icon, Grid } from 'semantic-ui-react';
import ClassList from '../class/ClassList';
import CCreate from '../class/CCreate';
import ClassEdit from '../class/ClassEdit';

export default function Create() {
  const dispatch = useDispatch();
  const classes = useSelector(selectClassState).classes;
  const topics = useSelector(selectTopicState).topics;
  const exams = useSelector(selectExamsState).exams;
  const questions = useSelector(selectQuestionState).questions;
  const choices = useSelector(selectChoicesState).choices;
  const user = useSelector(selectUser).user;
  const loading = useSelector(selectLoadingState).loadingComps?.Create;

  const [activeIndex, setActiveIndex] = useState(null);
  // data.active is what it active before the click
  function handleAccordClick(event, data) {
    if (data.active === false) {
      setActiveIndex(data.index);
    } else {
      setActiveIndex(-1);
    }
  }

  function loadAccords(arr) {
    return arr.map((val, index) => {
      return (
        <Accordion>
          <Accordion.Title active={activeIndex === index} index={index} onClick={handleAccordClick}>
            <Icon name='dropdown' />
            {val.name}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === index}>
            <Grid columns={3} stackable doubling centered style={{ marginTop: '.3rem' }}>
              {val.component}
            </Grid>
          </Accordion.Content>
        </Accordion>
      );
    });
  }

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
  return (
    <Container>
      <Segment loading={loading}>
        {loadAccords([{ name: 'Classes', component: <ClassList editMode={true} classes={classes} /> }])}
      </Segment>
    </Container>
  );
}
