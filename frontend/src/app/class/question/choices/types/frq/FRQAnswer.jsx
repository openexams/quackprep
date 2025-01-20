import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Message, Segment, Button } from 'semantic-ui-react';
import { selectItemById } from 'maddox-js-funcs';
import { selectCurrentChoicesState, checkStudentFRQAnswer } from '../../choicesSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import { changeNavbarPage } from '@components/navbar/navbarSlice';
import { selectUser } from '@src/app/auth/authSlice';
import AIResponseComponent from './ai/AiResponse';
import { CustomImageLoader } from '@components/CustomLoader/CustomImageLoader';
import MarkdownRenderer from '@components/MarkdownRenderer';

// Helper function to determine the label color based on grade
/**
 *
 * @param {Number} grade
 * @returns {SemanticCOLORS}
 */
export function getGradeColor(grade) {
  if (grade == null) return 'grey';
  if (grade >= 90) return 'green';
  if (grade >= 70) return 'yellow';

  return 'red';
}

export default function FRQAnswer({ text, choice, selectedQuestion }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectLoadingState).loadingComps;
  const currentChoice = selectItemById(useSelector(selectCurrentChoicesState), 'choice_id', choice?.id);
  const user_id = useSelector(selectUser).user?.id;

  return (
    <Segment basic loading={loading?.FRQAnswer}>
      <CustomImageLoader active={loading?.AiGrade} content={'Generating AI Grade (~5s)'}>
        <Message
          color={getGradeColor(currentChoice?.grade)}
          style={{ marginTop: '2rem', textAlign: 'center', borderRadius: '10px' }}
        >
          <Message.Header>Your Answer:</Message.Header>
          <p
            style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {text || '(No answer provided)'}
          </p>
          <Message.Header style={{ marginTop: '1rem' }}>Correct Answer:</Message.Header>
          <p style={{ color: '#21ba45', fontWeight: 'bold' }}>
            <MarkdownRenderer render={choice.answer} />
          </p>
        </Message>
        {!currentChoice?.ai_response && (
          <Button
            fluid
            onClick={() => {
              if (!user_id) {
                dispatch(changeNavbarPage(navigate, '/auth'));
              } else if (currentChoice?.ai_response) {
                console.log('brotha u alr generated one'); // button should be hidden so this never seen
              } else if (user_id && currentChoice) {
                dispatch(checkStudentFRQAnswer(currentChoice.trans_id, selectedQuestion.question, text, choice.answer));
              } else {
                console.error('fatal error cur choice not found when trying to gen ai response');
              }
            }}
          >
            {currentChoice?.ai_response ? 'na' : user_id ? '🤖Generate AI Grade🤖' : 'Login To Generate Ai Question'}
          </Button>
        )}
        {currentChoice?.ai_response && (
          <AIResponseComponent responseText={currentChoice.ai_response} grade={currentChoice.grade} />
        )}
      </CustomImageLoader>
    </Segment>
  );
}
