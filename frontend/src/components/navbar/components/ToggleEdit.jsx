import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'semantic-ui-react';
import { selectEditState } from '@src/app/auth/authSlice';
import { toggleEdit } from '../navbarSlice';
import { selectUser } from '@src/app/auth/authSlice';

const ToggleEditComponent = () => {
  const is_creator = useSelector(selectUser).user?.is_creator;
  const editing = useSelector(selectEditState);
  const dispatch = useDispatch();
  if (!is_creator) {
    return null;
  }
  return (
    <div style={{ padding: '20px', maxWidth: '300px', margin: 'auto' }}>
      <h3>Toggle Edit: {editing ? 'True' : 'False'}</h3>

      <Checkbox toggle checked={editing} onChange={() => dispatch(toggleEdit())} label={editing ? 'Editing' : 'Not Editing'} />
    </div>
  );
};

export default ToggleEditComponent;
