import { useEffect, useMemo, useState } from 'react';
import { Grid, Header, Segment, Button, Icon } from 'semantic-ui-react';
import QuestionList from './QuestionList';
import { useDispatch, useSelector } from 'react-redux';
import { changeNavbarPage, selectNavbarState } from '@app/layout/navbar/navbarSlice';
import { selectLoadingState } from '@app/store/loadingSlice';
import ChoiceRouter from './choices/ChoiceRouter';
import { useNavigate } from 'react-router-dom';
import QuestionReport from './qreport/QuestionReport';
import { selectItemById, selectItemsById } from 'maddox-js-funcs';
import NoItemsFound from '@components/NoItemsFound';
import { CustomImageLoader } from '@components/CustomLoader/CustomImageLoader';
import QuestionVote from './vote/QuestionVote';
import QuestionNext from './QuestionNext';
import { updateQuestionId } from '@app/layout/navbar/navbarSlice';
import useIsMobile from '@utils/hooks/useIsMobile';
import QuestionPostMain from './post/QuestionPostMain';
import { selectQuestionsByGroupId } from './questionSlice';
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

function getLocalShowAIQuestions() {
  const showAIQuestions = window.localStorage.getItem('showAIQuestions');
  if (showAIQuestions) {
    return showAIQuestions === 'true';
  }
  return true;
}

/**
 * @param {Boolean} showAIQuestions
 */
function setLocalShowAIQuestions(showAIQuestions) {
  window.localStorage.setItem('showAIQuestions', String(showAIQuestions));
}
// TODO FIX THIS SHITTY COMPONENT AND PAGE
export default function QuestionPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { schoolName, classId, groupId, groupName, questionId } = useSelector(selectNavbarState).navbar;
  /**@type {import('../../../../../types.ts').Question[]} */
  let questions = useSelector(selectQuestionsByGroupId());

  const questionPageLoading = useSelector(selectLoadingState).loadingComps?.QuestionPage;
  const questionVoteLoading = useSelector(selectLoadingState).loadingComps?.QuestionVote;
  const generateQuestionLoading = useSelector(selectLoadingState).loadingComps?.GenerateQuestion;

  const [selectedQuestion, setSelectedQuestion] = useState({});

  /// for ai show toggle
  const [showAIQuestions, setShowAIQuestions] = useState(getLocalShowAIQuestions());
  questions = useMemo(() => {
    if (showAIQuestions) {
      return questions;
    } else {
      selectItemsById(questions, 'ai', 0);
    }
  }, [showAIQuestions, questions]);
  useEffect(() => {
    setLocalShowAIQuestions(showAIQuestions);
  }, [showAIQuestions]);
  ///

  useEffect(() => {
    // hydrate state
    if (questions != null && questions?.length !== 0) {
      if (!questionId) {
        dispatch(updateQuestionId(parseInt(questions?.[0]?.id)));
        dispatch(changeNavbarPage(navigate, parseInt(questions?.[0]?.id)));
      }
    }
  }, [questions?.length]); // could lead to issues

  useEffect(() => {
    // keep selected question state same as navbar
    if (questionId && questions?.length > 0 && questionPageLoading === false) {
      setSelectedQuestion(selectItemById(questions, 'id', questionId));
    }
  }, [questionId, questionPageLoading]); // if you watch questions it will rerender every milisecond idk why

  useEffect(() => {
    // change navbar state when selected question id changes
    if (!questionPageLoading && selectedQuestion?.id) {
      dispatch(
        changeNavbarPage(navigate, `/class/${schoolName}/${classId}/group/${groupId}/question/${parseInt(selectedQuestion.id)}`),
      ); // why dude TODO FIX
      dispatch(updateQuestionId(parseInt(selectedQuestion.id)));
    }
  }, [selectedQuestion?.id, questionVoteLoading, questionPageLoading]);

  // handles selected question locally

  if (!questions)
    return (
      <Segment loading={questionPageLoading}>
        <Header>Loading</Header>
      </Segment>
    );

  return (
    <Segment basic loading={questionPageLoading}>
      <CustomImageLoader content={'generating ai question (takes ~10s)'} active={generateQuestionLoading}>
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
                    <NoItemsFound title={'Question'} message={'No questions found, try enabling AI questions'} />
                  )}
                </Segment>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </CustomImageLoader>
      {selectedQuestion?.id && <QuestionPostMain questionId={selectedQuestion.id} />}
    </Segment>
  );
}
