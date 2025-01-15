import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Dropdown, Button, Segment, Header } from 'semantic-ui-react';

import { upsertClass, deleteClassById } from '@src/app/class/classSlice';
import { mapSchoolsToDropdown, mapClassCategoriesToDropdown } from './dropdownMappings';

import ConfirmButton from '@components/ConfirmButton';

import { selectSchoolState } from '@src/app/class/school/schoolSlice';
import { selectClassCategories } from '@src/app/class/class_categories/classCategorySlice';

export default function ClassEditor({ id, name, category, desc, school_id }) {
  const dispatch = useDispatch();

  // Pull your Redux state
  const { schools } = useSelector(selectSchoolState);
  const { class_categories: classCategories } = useSelector(selectClassCategories);

  // Local state for controlled components
  const [className, setClassName] = useState(name || '');
  const [classDesc, setClassDesc] = useState(desc || '');
  const [selectedSchool, setSelectedSchool] = useState(school_id || '');
  const [selectedCategory, setSelectedCategory] = useState(category || '');

  /**
   * Submit handler
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(upsertClass(id || null, selectedSchool, className, classDesc, selectedCategory));
  };

  /**
   * Delete handler
   */
  const handleDelete = () => {
    if (id) {
      dispatch(deleteClassById(id));
    }
  };

  return (
    <Segment>
      <Form onSubmit={handleSubmit}>
        <Header as={'h3'}>Class:{id}</Header>

        <Form.Field
          control='input'
          label='Class Name'
          required
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder='Class Name'
        />

        <Form.Field
          control='textarea'
          label='Class Description'
          required
          value={classDesc}
          onChange={(e) => setClassDesc(e.target.value)}
          placeholder='Description'
        />

        <Form.Field
          control={Dropdown}
          label='School'
          required
          selection
          clearable
          value={selectedSchool}
          onChange={(_, data) => setSelectedSchool(data.value)}
          options={mapSchoolsToDropdown(schools)}
          placeholder='Select School'
        />

        <Form.Field
          control={Dropdown}
          label='Class Category'
          required
          selection
          clearable
          value={selectedCategory}
          onChange={(_, data) => setSelectedCategory(data.value)}
          options={mapClassCategoriesToDropdown(classCategories)}
          placeholder='Select Category'
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
