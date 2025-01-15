import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Dropdown, Button, Segment } from 'semantic-ui-react';

import ConfirmButton from '@components/ConfirmButton';

// Example actions (adjust paths as needed)
import { upsertGroup, deleteGroupById } from '@src/app/class/group/groupSlice';
import { selectClassState } from '@src/app/class/classSlice';

// Example mapper (adjust path as needed)
import { mapClassesToDropdown } from './dropdownMappings';

/**
 * Example "type" options as an enum-like dropdown.
 * Adjust as needed for your real enum values.
 */
const GROUP_TYPES = [
  { key: 'exam', value: 'exam', text: 'Exam' },
  { key: 'topic', value: 'topic', text: 'Topic' },
];

export default function GroupEditor({ id, name, type, description, class_id }) {
  const dispatch = useDispatch();

  // Pull your Redux state
  const { classes } = useSelector(selectClassState);

  // Local state for controlled components
  const [groupName, setGroupName] = useState(name || '');
  const [groupType, setGroupType] = useState(type || '');
  const [groupDesc, setGroupDesc] = useState(description || '');
  const [selectedClass, setSelectedClass] = useState(class_id || '');

  /**
   * Submit handler
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(upsertGroup(id || null, groupName, selectedClass, groupType, groupDesc));
  };

  /**
   * Delete handler
   */
  const handleDelete = () => {
    if (id) {
      dispatch(deleteGroupById(id));
    }
  };

  return (
    <Segment>
      <Form onSubmit={handleSubmit}>
        <Form.Field
          control='input'
          label='Group Name'
          required
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder='Group Name'
        />

        <Form.Field
          control='textarea'
          label='Group Description'
          required
          value={groupDesc}
          onChange={(e) => setGroupDesc(e.target.value)}
          placeholder='Description'
        />

        <Form.Field
          control={Dropdown}
          label='Group Type'
          required
          selection
          clearable
          value={groupType}
          onChange={(_, data) => setGroupType(data.value)}
          options={GROUP_TYPES}
          placeholder='Select a Group Type'
        />

        <Form.Field
          control={Dropdown}
          label='Associated Class'
          required
          selection
          clearable
          value={selectedClass}
          onChange={(_, data) => setSelectedClass(data.value)}
          options={mapClassesToDropdown(classes)}
          placeholder='Select a Class'
        />

        <Button type='submit' primary>
          Submit
        </Button>

        {id && (
          <ConfirmButton onClick={handleDelete} negative>
            Delete
          </ConfirmButton>
        )}
      </Form>
    </Segment>
  );
}
