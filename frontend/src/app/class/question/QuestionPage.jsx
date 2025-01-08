import { useEffect, useState } from 'react';
import { Grid, Header, Segment, Button, Icon } from 'semantic-ui-react';
import QuestionList from './QuestionList';
import { useDispatch, useSelector } from 'react-redux';
import { changeNavbarPage, selectNavbarState } from '@components/navbar/navbarSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import ChoiceRouter from './choices/ChoiceRouter';
import { useNavigate } from 'react-router-dom';
import ChatbotWidget from '@src/app/chatbot/ChatbotWidget';
import QuestionReport from './qreport/QuestionReport';
import { selectArrayOfStateByGroupId } from '@utils/helperFuncs';
import { selectItemById } from 'maddox-js-funcs';
import NoItemsFound from '@components/NoItemsFound';

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { groupId, groupName, questionId } = useSelector(selectNavbarState).navbar;

  const questions = useSelector(selectArrayOfStateByGroupId('app.question.questions', groupId));

  const loadingComps = useSelector(selectLoadingState).loadingComps;

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    // if the user didnt start w a question id
    if (questions != null && questions?.length !== 0 && !questionId) {
      dispatch(changeNavbarPage(navigate, parseInt(questions?.[0]?.id)));
    }
  }, [questions?.[0]]); // could lead to issues

  useEffect(() => {
    if (Array.isArray(questions)) {
      if (questionId) {
        const selectedQ = findQuestionById(questions, parseInt(questionId));
        if (selectedQ) {
          setSelectedQuestion(selectedQ);
        }
      }
    }
  }, [questions?.[0], questionId]);

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
              <Segment>
                <ChoiceRouter selectedQuestion={selectedQuestion} />
                {selectedQuestion?.id && <QuestionReport questionId={selectedQuestion?.id} />}
                {selectedQuestion?.explanation_url && (
                  <Button as={'a'} href={selectedQuestion?.explanation_url} target='_blank'>
                    <Icon color='red' name='youtube' />
                    Show Explanation
                  </Button> // popup modal later
                )}
              </Segment>
            ) : (
              <Segment>
                {selectItemById(questions, 'id', questionId) ? ( // if question is selected and I cant find it then it dne
                  <Header as='h3'>Please select a question from the list.</Header>
                ) : (
                  <NoItemsFound title={'Question'} />
                )}
              </Segment>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <ChatbotWidget />
    </Segment>
  );
}
