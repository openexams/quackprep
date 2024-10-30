import React, { useEffect, useState } from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import QuestionList from './QuestionList';
import QuestionChoices from './QuestionChoices';
import { useDispatch, useSelector } from 'react-redux';
import { selectArrayOfStateById } from '@utils/functions';
import { selectNavbarState } from '@components/navbar/navbarSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';

/**
 *
 * @param {Array} questions
 * @param {Int} id
 */
function findQuestionById(questions, id) {
  if (!questions || !id) {
    return null;
  }
  for (let i = 0; i < questions.length; i++) {
    if (questions[i].id == id) {
      return { ...questions[i] };
    }
  }
  return null;
}

export default function QuestionPage() {
  const dispatch = useDispatch();
  const { groupId, groupName, questionId, groupType } = useSelector(selectNavbarState).navbar;

  const questions = useSelector(selectArrayOfStateById('app.question.questions', 'group_id', groupId));

  const loadingComps = useSelector(selectLoadingState).loadingComps;

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    // init for selected question
    if (questions != null && questions != [] && questionId && selectedQuestion == null) {
      setSelectedQuestion(findQuestionById(questions, parseInt(questionId)));
    }
  }, [questionId, questions]);

  useEffect(() => {
    if (questions != null && questions != [] && questionId) {
      setSelectedQuestion(findQuestionById(questions, parseInt(questionId)));
    }
  }, [questionId]);

  // handles selected question locally

  if (!questions)
    return (
      <Segment loading={loadingComps.QuestionPage}>
        <Header>Loading</Header>
      </Segment>
    );
  return (
    <Segment basic loading={loadingComps.QuestionPage}>
      <Header style={{ fontSize: '2.5rem' }} textAlign='center'>
        {groupName}
      </Header>
      <Grid divided>
        <Grid.Row>
          <Grid.Column width={4}>
            <QuestionList questions={questions} selectedQuestion={selectedQuestion} />
          </Grid.Column>
          <Grid.Column width={12}>
            {selectedQuestion ? (
              <QuestionChoices selectedQuestion={selectedQuestion} />
            ) : (
              <Segment>
                <Header as='h3'>Please select a question from the list.</Header>
              </Segment>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
}
