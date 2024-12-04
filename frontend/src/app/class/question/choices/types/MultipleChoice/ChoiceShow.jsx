import React, { useEffect, useState } from 'react';
import { List, Button, Transition } from 'semantic-ui-react';
import './AnswerButton.css';
import MarkdownRenderer from '@components/MarkdownRenderer';
import { useDispatch, useSelector } from 'react-redux';
import { postAnswer, upsertCurrentAnswer } from '../../choicesSlice';
import { selectUser } from '@src/app/auth/authSlice';

export default function ChoiceShow({ id, answer, is_correct, showAnswers, setShowAnswers, selectedQuestionId, resetClicked }) {
  const [disabled, setDisabled] = useState();
  const user = useSelector(selectUser).user;
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

  return (
    <List.Item className='answer-list-item'>
      <div className='answer-wrapper'>
        <Button
          disabled={disabled}
          className={getButtonClass()}
          onClick={() => {
            if (!showAnswers) {
              setShowAnswers(true);
              if (user?.id) {
                // only do a request if a user is logged in

                dispatch(upsertCurrentAnswer(id, selectedQuestionId));
              }
              // answers_transactional does not need user_id
              dispatch(postAnswer(id));

              if (is_correct) {
                console.log('correct! yay!');
              }
            }
          }}
          fluid
        >
          <div className='answer-content'>
            <MarkdownRenderer render={answer} />
            {showAnswers && (
              <Transition visible={showAnswers} animation='fade' duration={300}>
                <div className={`result-indicator ${is_correct ? 'correct' : 'incorrect'}`}>
                  <i className={`icon ${is_correct ? 'check circle' : 'times circle'}`} />
                </div>
              </Transition>
            )}
          </div>
        </Button>

        {/* Small button rendered outside the main button but positioned inside using CSS */}
        {!showAnswers && (
          <Button
            icon='ban black'
            size='large'
            className='disable-toggle extra'
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1, // Ensure it appears on top of the main button
            }}
            onClick={(e) => {
              e.stopPropagation();
              setDisabled(!disabled);
            }}
          />
        )}
      </div>
    </List.Item>
  );
}
