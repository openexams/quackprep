import CreateInputForm from '@components/CreateInputForm';
import { useDispatch } from 'react-redux';
import { upsertClass } from './classSlice';
import { Segment } from 'semantic-ui-react';

export default function CCreate() {
  const dispatch = useDispatch();
  return (
    <Segment>
      Create Class
      <CreateInputForm
        formFields={[
          { name: 'school_id', value: '', required: true },
          { name: 'name', value: '', required: true },
          { name: 'description', value: '', required: true },
          { name: 'category', value: '', required: true },
        ]}
        onSubmit={({ school_id, name, description, category }) => {
          dispatch(upsertClass(school_id, name, description, category));
        }}
      />
    </Segment>
  );
}
