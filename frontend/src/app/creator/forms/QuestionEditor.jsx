import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { Form, Dropdown, Button, Segment, Header } from 'semantic-ui-react';
import { selectGroupsState } from '@app/class/group/groupSlice';
import { mapGroupsToDropdown } from './dropdownMappings';
import { deleteQuestionById, upsertQuestionWithGroupIds } from '@app/class/question/questionSlice';
import ConfirmButton from '@components/ConfirmButton';
import MarkdownEditor from './MarkdownEditor';

export default function QuestionEditor({ id, group_ids, explanation_url, question }) {
  const dispatch = useDispatch();
  const allGroups = useSelector(selectGroupsState);
  group_ids = String(group_ids);
  const initialGroupIds = group_ids?.includes(',')
    ? group_ids?.split(',').map((group) => parseInt(group))
    : [parseInt(group_ids)];

  const [selectedGroups, setSelectedGroups] = useState(initialGroupIds);
  const [questionText, setQuestionText] = useState(question || '');
  const [explanationUrl, setExplanationUrl] = useState(explanation_url || '');

  /**
   * Submit handler
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(upsertQuestionWithGroupIds(id || null, questionText, selectedGroups, explanationUrl));
  };

  return (
    <Segment key={id ? `question-${id}-${initialGroupIds}` : `question-new-${initialGroupIds}`}>
      <Form onSubmit={handleSubmit}>
        <Header as={'h3'}> {id ? `Question:${id}` : 'Create New Question'} </Header>
        <MarkdownEditor
          label='Question'
          required
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder='Enter your question here...'
        />

        <Form.Input
          disabled
          label='Explanation URL'
          value={explanationUrl}
          onChange={(e) => setExplanationUrl(e.target.value)}
          placeholder='Paste a URL for explanation (optional)'
        />

        <Form.Field
          required
          search
          control={Dropdown}
          label='Related Groups'
          placeholder='Select one or more groups'
          multiple
          selection
          value={selectedGroups}
          onChange={(_, data) => setSelectedGroups(data.value)}
          options={mapGroupsToDropdown(allGroups)}
        />

        <Button type='submit' primary>
          Submit
        </Button>
      </Form>
      {id && <ConfirmButton color='red' content='Delete' onClick={() => dispatch(deleteQuestionById(id))} />}
    </Segment>
  );
}
