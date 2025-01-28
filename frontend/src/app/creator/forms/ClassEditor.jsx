import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Dropdown, Button, Segment, Header } from 'semantic-ui-react';

import { upsertClass, deleteClassById } from '@app/class/classSlice';
import { mapSchoolsToDropdown, mapClassCategoriesToDropdown } from './dropdownMappings';

import ConfirmButton from '@components/ConfirmButton';

import { selectSchoolState } from '@app/class/school/schoolSlice';
import { selectClassCategories } from '@app/class/class_categories/classCategorySlice';
import { useNavigate } from 'react-router-dom';
import { changeNavbarPage } from '@app/layout/navbar/navbarSlice';

export function highLightClassCreate() {
  const classCreate = document.getElementById('class_create');
  if (classCreate) {
    classCreate.scrollIntoView({ behavior: 'smooth', block: 'center' });

    classCreate.classList.add('highlight');

    // Remove the highlight class after 2 seconds
    setTimeout(() => {
      classCreate.classList.remove('highlight');
    }, 2000);
  } else {
    console.error('No class create');
  }
}

export default function ClassEditor({ id, name, category, desc, school_id }) {
  const navigate = useNavigate();
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
    dispatch(upsertClass(id || null, selectedSchool || null, className, classDesc, selectedCategory));
  };

  return (
    <Segment
      id={id ? `class_edit_${school_id}` : 'class_create'}
      key={id ? `class-${id}-${school_id}` : `class-create-${school_id}`}
    >
      <Form onSubmit={handleSubmit}>
        <Header as='h3'>{id ? `Class:${id}` : 'Create New Class'}</Header>

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
          placeholder={'Provide a meaningful general description of the class.\nex: "Purdue Calculus 2"'}
        />

        <Form.Field
          search
          control={Dropdown}
          label='School'
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
          search
          selection
          clearable
          value={selectedCategory}
          onChange={(_, data) => setSelectedCategory(data.value)}
          options={mapClassCategoriesToDropdown(classCategories)}
          placeholder='Select Category'
        />

        <Button style={{ marginTop: '-.3em' }} type='submit' primary>
          {id ? 'Update' : 'Create'}
        </Button>
      </Form>

      {id && (
        <Button
          style={{ marginTop: '1em' }}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(changeNavbarPage(navigate, `/create`));
          }}
          primary
        >
          Ai Generate Content -&gt;
        </Button>
      )}

      {id && (
        <ConfirmButton onClick={() => dispatch(deleteClassById(id))} negative>
          Delete
        </ConfirmButton>
      )}
    </Segment>
  );
}
