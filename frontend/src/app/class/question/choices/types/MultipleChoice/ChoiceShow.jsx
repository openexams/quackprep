import { useEffect, useState } from 'react';
import { List, Button, Icon, Progress } from 'semantic-ui-react';
import './AnswerButton.css';
import MarkdownRenderer from '@components/MarkdownRenderer';
import { useDispatch } from 'react-redux';
import { upsertCurrentChoiceAndPostAnswer } from '../../choicesSlice';

export default function ChoiceShow({
  id,
  answer,
  is_correct,
  showAnswers,
  setShowAnswers,
  selectedQuestionId,
  resetClicked,
  num_submission,
  total_submissions,
}) {
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();

  const getButtonClass = () => {
    let classes = ['answer-button'];
    if (disabled) classes.push('disabled');
    if (showAnswers) {
      classes.push(is_correct ? 'correct' : 'incorrect');
    }
    return classes.join(' ');
  };

  useEffect(() => {
    setDisabled(false);
  }, [resetClicked]);

  const handleAnswerClick = () => {
    if (!showAnswers) {
      setShowAnswers(true);
      dispatch(upsertCurrentChoiceAndPostAnswer(id, selectedQuestionId, null));
      if (is_correct) {
        console.log('correct!');
      }
    }
  };

  const submissionPercentage = total_submissions !== 0 ? (num_submission / total_submissions) * 100 : 0;

  return (
    <List.Item className='answer-list-item' style={{ position: 'relative', overflow: 'hidden' }}>
      <div className='answer-wrapper' style={{ position: 'relative' }}>
        <Button
          size='small'
          disabled={disabled}
          className={getButtonClass()}
          onClick={handleAnswerClick}
          fluid
          style={{ position: 'relative', overflow: 'hidden', padding: '1em' }}
        >
          {showAnswers && (
            <Progress
              className='full-height-progress'
              color={is_correct ? 'green' : 'red'}
              percent={submissionPercentage}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                margin: 0,
                padding: 0,
                zIndex: 1,
              }}
            />
          )}

          <div className='answer-content' style={{ position: 'relative', zIndex: 2 }}>
            <MarkdownRenderer render={answer} />

            {showAnswers && (
              <div
                className='submission-info'
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: 'black',
                  opacity: 0.4,
                  pointerEvents: 'none',
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                  zIndex: 3,
                }}
              >
                {num_submission} Submissions
              </div>
            )}
          </div>
        </Button>

        {!showAnswers && (
          <Button
            icon={<Icon style={{ opacity: 0.4 }} color='black' name='strikethrough' />}
            size='large'
            className='disable-toggle extra'
            style={{
              opacity: 0.7,
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 50,
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDisabled(!disabled);
            }}
          />
        )}
      </div>
    </List.Item>
  );
}
