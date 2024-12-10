import './buttonChoices.css';
import React, { useEffect, useState } from 'react';
import { Segment, Header, List, Button, Divider } from 'semantic-ui-react';

import { randomizeArray } from 'maddox-js-funcs';
import ChoiceShow from './ChoiceShow';

export default function MultipleChoice({ choices, selectedQuestion }) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [resetClicked, setResetClicked] = useState(0);

  choices = randomizeArray(choices, 1234);

  let total_submissions = 0;
  for (let i = 0; i < choices?.length; i++) {
    total_submissions += choices[i]?.num_submissions;
  }

  // on question change
  useEffect(() => {
    setShowAnswers(false);
    setResetClicked(resetClicked + 1);
  }, [selectedQuestion]);

  return (
    <Segment basic>
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
              resetClicked={resetClicked}
              num_submission={choice?.num_submissions || 0}
              total_submissions={total_submissions}
            />
          ),
        )}
      </List>
      <Button
        className='reset-button extra'
        floated='right'
        onClick={() => {
          // make dispatch to reset answers current as well TODO
          setResetClicked(resetClicked + 1);
          setShowAnswers(false);
        }}
      >
        Reset
      </Button>
    </Segment>
  );
}
