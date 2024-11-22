// todo
// have inputs that filter, ex. class id = 6 - pull in all rows that relate to that class id and as it goes down it gets narrower

import { Segment, Input, Form, Icon } from 'semantic-ui-react';

// join like in sql to filter
export default function CreateFilter({ filter, setFilter }) {
  function onChange(key, value) {
    setFilter({ ...filter, [key]: value });
  }
  return (
    <Segment>
      <Form>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>School ID</label>
            <Input
              onChange={(e, data) => {
                onChange('school_id', data.value);
              }}
              icon={<Icon name='university' />}
              iconPosition='left'
              value={filter.school_id}
              placeholder='Enter school id'
            />
          </Form.Field>
          <Form.Field>
            <label>Class Category</label>
            <Input
              onChange={(e, data) => {
                onChange('class_type', data.value);
              }}
              icon={<Icon name='book' />}
              iconPosition='left'
              value={filter.class_type}
              placeholder='Enter class category'
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Class ID</label>
            <Input
              onChange={(e, data) => {
                onChange('class_id', data.value);
              }}
              icon={<Icon name='id badge' />}
              iconPosition='left'
              value={filter.class_id}
              placeholder='Enter class ID'
            />
          </Form.Field>
          <Form.Field>
            <label>Pdf Id</label>
            <Input
              onChange={(e, data) => {
                onChange('pdf_id', data.value);
              }}
              icon={<Icon name='id badge' />}
              iconPosition='left'
              value={filter.pdf_id}
              placeholder='Enter pdf ID'
            />
          </Form.Field>
          <Form.Field>
            <label>Group ID</label>
            <Input
              onChange={(e, data) => {
                onChange('group_id', data.value);
              }}
              icon={<Icon name='users' />}
              iconPosition='left'
              value={filter.group_id}
              placeholder='Enter group ID'
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Question ID</label>
            <Input
              onChange={(e, data) => {
                onChange('question_id', data.value);
              }}
              icon={<Icon name='question circle' />}
              iconPosition='left'
              value={filter.question_id}
              placeholder='Enter question ID'
            />
          </Form.Field>
          <Form.Field>
            <label>Choice ID</label>
            <Input
              onChange={(e, data) => {
                onChange('choice_id', data.value);
              }}
              icon={<Icon name='check circle' />}
              iconPosition='left'
              value={filter.choice_id}
              placeholder='Enter choice ID'
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </Segment>
  );
}
