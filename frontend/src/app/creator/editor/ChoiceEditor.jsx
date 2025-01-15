import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Checkbox, Dropdown, Button, Segment } from 'semantic-ui-react';
import { upsertChoice, deleteChoiceById } from '@src/app/class/question/choices/choicesSlice';
import ConfirmButton from '@components/ConfirmButton';

const TYPE_OPTIONS = [
  { key: 'frq', value: 'frq', text: 'FRQ' },
  { key: 'mcq', value: 'mcq', text: 'MCQ' },
];

export default function ChoiceEditor({ id, answer, is_correct, question_id, type, created_by }) {
  const dispatch = useDispatch();

  // Local state
  const [answerText, setAnswerText] = useState(answer || '');
  const [isCorrect, setIsCorrect] = useState(!!is_correct);
  const [choiceType, setChoiceType] = useState(type || '');

  /**
   * Submit handler
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(upsertChoice(answerText, question_id, isCorrect, choiceType, id || null));
  };

  return (
    <Segment>
      <Form onSubmit={handleSubmit}>
        <Form.Field
          width={'8'}
          control='textarea'
          label='Answer'
          required
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder='Enter the answer text'
        />

        <Form.Field>
          <Checkbox label='Is Correct?' checked={isCorrect} onChange={(_, data) => setIsCorrect(data.checked)} />
        </Form.Field>

        <Form.Field
          control={Dropdown}
          label='Choice Type'
          required
          selection
          clearable
          value={choiceType}
          onChange={(_, data) => setChoiceType(data.value)}
          options={TYPE_OPTIONS}
          placeholder='Select Choice Type'
        />

        <Button type='submit' primary>
          Submit
        </Button>
        {id && (
          <ConfirmButton onClick={() => deleteChoiceById(id)} negative>
            Delete
          </ConfirmButton>
        )}
      </Form>
    </Segment>
  );
}
