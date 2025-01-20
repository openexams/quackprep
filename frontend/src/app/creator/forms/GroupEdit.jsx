import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Dropdown, Button, Segment, Header } from 'semantic-ui-react';

import ConfirmButton from '@components/ConfirmButton';

// Example actions (adjust paths as needed)
import { upsertGroup, deleteGroupById } from '@src/app/class/group/groupSlice';
import { selectClassState } from '@src/app/class/classSlice';

// Example mapper (adjust path as needed)
import { mapClassesToDropdown, mapGrouptypesDropdown } from './dropdownMappings';

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

  return (
    <Segment id={id ? `group-${id}-${class_id}` : `group-new-${class_id}`}>
      <Form onSubmit={handleSubmit}>
        <Header as={'h3'}>{id ? `Group:${id}` : 'Create New Group'}</Header>

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
          options={mapGrouptypesDropdown}
          placeholder='Select a Group Type'
        />

        <Form.Field
          disabled
          search
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
      </Form>
      {id && (
        <ConfirmButton onClick={() => dispatch(deleteGroupById(id))} negative>
          Delete
        </ConfirmButton>
      )}
    </Segment>
  );
}
