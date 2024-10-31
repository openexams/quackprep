import './buttonChoices.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Segment, Header, List, Button, Divider } from 'semantic-ui-react';
import { postAnswer, upsertCurrentAnswer } from '../choicesSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import MarkdownRenderer from '@components/MarkdownRenderer';
import { randomizeArray } from '../../../../../../../shared/globalFuncs';

export default function MultipleChoice({ choices, selectedQuestion }) {
  const dispatch = useDispatch();

  const [showAnswers, setShowAnswers] = useState(false);

  // give choices a random order TODO LET THE USER DO THIS.
  choices = randomizeArray(choices, 1234);

  // navbar does not do this
  useEffect(() => {
    setShowAnswers(false);
  }, [selectedQuestion]);

  return (
    <List>
      {choices.map(
        (
          choice,
          index, // abstract out into another choices component.
        ) => (
          <List.Item key={index}>
            <Button
              className={showAnswers ? `${choice.is_correct ? 'custom-button custom-green' : 'custom-button custom-red'}` : ''}
              onClick={() => {
                if (!showAnswers) {
                  // if alr answered dont do this
                  setShowAnswers(true);
                  dispatch(postAnswer(choice.id));
                  dispatch(upsertCurrentAnswer(choice.id, selectedQuestion.id));
                  if (choice.is_correct) {
                    console.log('correct! yay!');
                  }
                }
              }}
              fluid
            >
              <MarkdownRenderer render={choice.answer} />
            </Button>
          </List.Item>
        ),
      )}
    </List>
  );
}
