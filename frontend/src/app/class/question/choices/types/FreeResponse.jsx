import { useState } from 'react';
import { Button, TextArea, Segment, Form } from 'semantic-ui-react';

export default function FreeResponse({ choice, selectedQuestion }) {
  const [text, setText] = useState();
  function onSubmit() {
    // does nothing save this data
    setText('');
  }
  return (
    <Segment basic>
      <h2>Free Response:</h2>
      <Form
        onSubmit={() => {
          onSubmit();
        }}
      >
        <TextArea
          value={text}
          onChange={(e, data) => setText(data.value)}
          style={{ width: '100%' }}
          rows={5}
          placeholder={'Input your answer here'}
        />
        <Button>Submit</Button>
      </Form>
    </Segment>
  );
}
