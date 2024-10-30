import './choices/buttonChoices.css';
import { selectArrayOfStateById } from '@utils/functions';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Segment, Header, List, Button, Divider } from 'semantic-ui-react';
import { getChoicesByQuestion, postAnswer, upsertCurrentAnswer } from './choices/choicesSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import MarkdownRenderer from '@components/MarkdownRenderer';
import { randomizeArray } from '../../../../../shared/globalFuncs';

export default function QuestionChoices({ selectedQuestion }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoadingState).loadingComps?.QuestionChoices;

  let choices = useSelector(selectArrayOfStateById('app.choices.choices', 'question_id', selectedQuestion?.id));
  const [showAnswers, setShowAnswers] = useState(false);

  // give choices a random order TODO LET THE USER DO THIS.
  choices = randomizeArray(choices, 1234);

  // navbar does not do this
  useEffect(() => {
    setShowAnswers(false);
  }, [selectedQuestion]);

  return (
    <Segment loading={loading}>
      {selectedQuestion && choices ? (
        <>
          <Header>
            <MarkdownRenderer render={selectedQuestion.question} />
          </Header>
          <Divider />
          <List>
            {choices.map(
              (
                choice,
                index, // abstract out into another choices component.
              ) => (
                <List.Item key={index}>
                  <Button
                    className={
                      showAnswers ? `${choice.is_correct ? 'custom-button custom-green' : 'custom-button custom-red'}` : ''
                    }
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
        </>
      ) : (
        <Header as='h3'>Please select a question from the list.</Header>
      )}
    </Segment>
  );
}
