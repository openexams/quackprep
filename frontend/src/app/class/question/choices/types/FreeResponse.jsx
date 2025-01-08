import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, TextArea, Segment, Form, Message, Header, Icon } from 'semantic-ui-react';
import { upsertCurrentChoiceAndPostAnswer } from '../choicesSlice';

export default function FreeResponse({ choice, selectedQuestion }) {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <Segment basic style={{ background: '#f7f9fc', borderRadius: '10px' }}>
      <Header as='h4' style={{ textAlign: 'center' }}>
        <Icon name='pencil alternate' size='mini' /> Free Response
      </Header>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          if (submitted) {
            // reset
            setText('');
            setSubmitted(false);
          } else {
            if (text) {
              dispatch(upsertCurrentChoiceAndPostAnswer(choice.id, selectedQuestion.id, text)); // check chatgpt to tell user wether they correct or na
            }
            setSubmitted(true);
          }
        }}
      >
        <TextArea
          maxLength={2048}
          disabled={submitted}
          value={text}
          onChange={(e, data) => setText(data.value)}
          style={{
            width: '100%',
            minHeight: '20rem',
            border: '1px solid #d4d4d5',
            borderRadius: '8px',
            padding: '1rem',
            backgroundColor: submitted ? '	#D3D3D3	' : '#ffffff',
          }}
          rows={5}
          placeholder={submitted ? 'reset to try again' : 'Type your answer here...'}
        />
        <Button type='submit' primary style={{ marginTop: '1rem', width: '100%', borderRadius: '5px' }}>
          {submitted ? 'Reset' : 'Submit'}
        </Button>
      </Form>

      {submitted && (
        <Message positive style={{ marginTop: '2rem', textAlign: 'center', borderRadius: '10px' }}>
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
          <p style={{ color: '#21ba45', fontWeight: 'bold' }}>{choice.answer}</p>
        </Message>
      )}
    </Segment>
  );
}
