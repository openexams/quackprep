import './choices/buttonChoices.css';
import { selectArrayOfStateById } from '@utils/functions';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Segment, Header, List, Button, Divider } from 'semantic-ui-react';
import { getChoicesByQuestion, postChoice } from './choices/choicesSlice';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import MarkdownRenderer from '@components/MarkdownRenderer';

export default function QuestionChoices({ selectedQuestion }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoadingState).loadingComps?.QuestionChoices;

  const choices = useSelector(selectArrayOfStateById('app.choices.choices', 'question_id', selectedQuestion?.id));
  const [showAnswers, setShowAnswers] = useState(false);

  // navbar does not do this
  useEffect(() => {
    setShowAnswers(false);
    if ((choices?.length == 0 || choices === null) && selectedQuestion) {
      // testable
      dispatch(getChoicesByQuestion(selectedQuestion.id));
    }
  }, [selectedQuestion]); // if selected question changes get the new choices only if I dont already have them pulled in.

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
                        dispatch(postChoice(choice.id));
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
