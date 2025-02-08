import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, TextArea, Button, Segment, Header } from 'semantic-ui-react';
import { upsertQuestionPost } from './questionPostSlice';

export default function QuestionPostInput({ id, post_id, text, parent_username, question_id }) {
  const dispatch = useDispatch();
  const [curText, setCurText] = useState(text || '');

  const handleSubmit = (e, d) => {
    e.preventDefault();
    dispatch(upsertQuestionPost(question_id, id, post_id, curText));
  };

  if (!question_id) {
    console.error('NEED QUESTION ID');
    return null;
  }
  let maintext = '';

  if (id) {
    maintext = 'Edit Your Post';
  } else if (parent_username && post_id && !text) {
    maintext = `Reply to ${parent_username}`;
  } else if (!id && !post_id && !text) {
    maintext = 'Create a New Post';
  } else {
    console.error('Invalid props for QuestionPostInput');
    return null;
  }

  return (
    <Segment size='tiny'>
      <Header as='h4' dividing>
        {maintext}
      </Header>

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <TextArea
            placeholder={parent_username ? `Reply to ${parent_username}` : 'Type your post here...'}
            value={curText}
            onChange={(e, { value }) => setCurText(value)}
            style={{ minHeight: 100 }}
          />
        </Form.Field>
        <Button primary type='submit'>
          Submit
        </Button>
      </Form>
    </Segment>
  );
}
