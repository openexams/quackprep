import React, { useState } from 'react';
import { List, Button, Transition } from 'semantic-ui-react';
import './AnswerButton.css';
import MarkdownRenderer from '@components/MarkdownRenderer';

const AnswerButton = ({ id, answer, is_correct, showAnswers, setShowAnswers, selectedQuestionId }) => {
  const [disabled, setDisabled] = useState(false);

  const getButtonClass = () => {
    let classes = ['answer-button'];
    if (disabled) classes.push('disabled');
    if (showAnswers) {
      classes.push(is_correct ? 'correct' : 'incorrect');
    }
    return classes.join(' ');
  };

  return (
    <List.Item className='answer-list-item'>
      <div className='answer-wrapper'>
        <Button
          disabled={disabled}
          className={getButtonClass()}
          onClick={() => {
            if (!showAnswers) {
              setShowAnswers(true);
              dispatch(postAnswer(id));
              dispatch(upsertCurrentAnswer(id, selectedQuestionId));
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
};

export default AnswerButton;
