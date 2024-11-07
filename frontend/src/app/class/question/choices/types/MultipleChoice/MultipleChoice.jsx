import './buttonChoices.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Segment, Header, List, Button, Divider } from 'semantic-ui-react';

import { randomizeArray } from '../../../../../../../../shared/globalFuncs';
import ChoiceShow from './ChoiceShow';

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
    <>
      <List>
        {choices.map(
          (
            choice,
            index, // abstract out into another choices component.
          ) => (
            <ChoiceShow
              key={index}
              id={choice.id}
              answer={choice.answer}
              is_correct={choice.is_correct}
              selectedQuestionId={selectedQuestion?.id}
              setShowAnswers={setShowAnswers}
              showAnswers={showAnswers}
            />
          ),
        )}
      </List>
      <Button
        className='reset-button extra'
        floated='right'
        onClick={() => {
          // make dispatch to reset answers current as well TODO
          setShowAnswers(false);
        }}
      >
        Reset
      </Button>
    </>
  );
}
