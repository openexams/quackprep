import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextArea, Form, Dropdown, Button, Input } from 'semantic-ui-react';
import { upsertClass } from '@src/app/class/classSlice';
import { useParams } from 'react-router-dom';
import { selectItemById } from 'maddox-js-funcs';
import { mapSchoolsToDropdown, mapClassCategoriesToDropdown } from './dropdownMappings';

export default function ClassEditor({ classes, schools, class_categories }) {
  const [school, setSchool] = useState(null);
  const [classCategory, setClassCategory] = useState(null);
  const dispatch = useDispatch();
  const params = useParams();
  const { class_id } = params;
  const curClass = selectItemById(classes, 'id', parseInt(class_id)); // may or may not have as this form is a upsert form

  return (
    <Form
      onSubmit={(e, d) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        dispatch(
          upsertClass(curClass?.id | null, school?.id, formData.get('name'), formData.get('description'), classCategory.id),
        );
      }}
    >
      <Input
        key={curClass?.id ? `${curClass.id}_class_name` : 'default_name'}
        label={'Class Name'}
        required
        defaultValue={curClass?.name || ''}
        type='text'
        name='name'
        placeholder='Class Name'
      />
      <TextArea
        key={curClass?.category ? `${curClass.category}_class_desc` : 'default_desc'}
        label={'Class Description'}
        required
        defaultValue={curClass?.description || ''}
        type='text'
        name='description'
        placeholder='Description'
      />
      <Dropdown
        required
        value={school || curClass?.school_id || null} // Bind value
        options={mapSchoolsToDropdown(schools)}
        onChange={(e, d) => setSchool(d.value)}
        name='school_id'
        placeholder='School ID'
        selection
      />
      <Dropdown
        required
        value={classCategory || curClass?.category || null} // Bind value
        onChange={(e, d) => setClassCategory(d.value)}
        options={mapClassCategoriesToDropdown(class_categories)}
        placeholder='Class Category ID'
        name='class_category_id'
        selection
      />
      <Button type='submit'>Submit</Button>
    </Form>
  );
}
