import { useEffect, useState } from 'react';
import { Grid, Header, Segment, Button, Icon } from 'semantic-ui-react';
import QuestionList from './QuestionList';
import { useDispatch, useSelector } from 'react-redux';
import { changeNavbarPage, selectNavbarState } from '@app/layout/navbar/navbarSlice';
import { selectLoadingState } from '@app/store/loadingSlice';
import ChoiceRouter from './choices/ChoiceRouter';
import { useNavigate } from 'react-router-dom';
import QuestionReport from './qreport/QuestionReport';
import { selectArrayOfStateByGroupId } from '@utils/helperFuncs';
import { selectItemById, selectItemsById } from 'maddox-js-funcs';
import NoItemsFound from '@components/NoItemsFound';
import { CustomImageLoader } from '@components/CustomLoader/CustomImageLoader';
import QuestionVote from './vote/QuestionVote';
import QuestionNext from './QuestionNext';
import { updateQuestionId } from '@app/layout/navbar/navbarSlice';
import useIsMobile from '@utils/hooks/useIsMobile';

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
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { schoolName, classId, groupType, groupId, groupName, questionId } = useSelector(selectNavbarState).navbar;

  let questions = useSelector(selectArrayOfStateByGroupId('app.question.questions', groupId));

  const loadingComps = useSelector(selectLoadingState).loadingComps;
  const questionVoteLoading = useSelector(selectLoadingState).loadingComps.QuestionVote;

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [showAIQuestions, setShowAIQuestions] = useState(true);
  questions = showAIQuestions ? questions : selectItemsById(questions, 'ai', 0);

  useEffect(() => {
    // if the user didnt start w a question id
    if (questions != null && questions?.length !== 0 && !questionId) {
      dispatch(changeNavbarPage(navigate, parseInt(questions?.[0]?.id)));
      dispatch(updateQuestionId(parseInt(questions?.[0]?.id)));
    }
  }, [questions?.[0]]); // could lead to issues

  useEffect(() => {
    if (Array.isArray(questions) && questionId) {
      const selectedQ = findQuestionById(questions, parseInt(questionId));
      if (selectedQ) {
        setSelectedQuestion(selectedQ);
      }
    }
  }, [questionId, questionVoteLoading, questions?.[0]]);

  useEffect(() => {
    if (!loadingComps.QuestionPage && selectedQuestion?.id) {
      dispatch(
        changeNavbarPage(navigate, `/class/${schoolName}/${classId}/group/${groupId}/question/${parseInt(selectedQuestion.id)}`),
      ); // why dude TODO FIX
      dispatch(updateQuestionId(parseInt(selectedQuestion.id)));
    }
  }, [selectedQuestion?.id]);

  // handles selected question locally

  if (!questions)
    return (
      <Segment loading={loadingComps.QuestionPage}>
        <Header>Loading</Header>
      </Segment>
    );

  return (
    <Segment basic loading={loadingComps.QuestionPage}>
      <CustomImageLoader content={'generating ai question (takes ~10s)'} active={loadingComps.GenerateQuestion}>
        <Header style={{ fontSize: '2.5rem' }} textAlign='center'>
          {groupName}
        </Header>
        <Grid divided>
          <Grid.Row>
            {!isMobile && (
              <Grid.Column width={4}>
                <QuestionList
                  setSelectedQuestion={setSelectedQuestion}
                  questions={questions}
                  selectedQuestion={selectedQuestion}
                  showAIQuestions={showAIQuestions}
                  setShowAIQuestions={setShowAIQuestions}
                />
              </Grid.Column>
            )}

            <Grid.Column width={isMobile ? 16 : 12}>
              {selectedQuestion ? (
                <Segment>
                  <ChoiceRouter selectedQuestion={selectedQuestion} />
                  <QuestionNext
                    questions={questions}
                    selectedQuestion={selectedQuestion}
                    setSelectedQuestion={setSelectedQuestion}
                  />
                  {selectedQuestion?.id && <QuestionVote questionId={selectedQuestion?.id} upvotes={selectedQuestion?.upvotes} />}
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
      </CustomImageLoader>
    </Segment>
  );
}
