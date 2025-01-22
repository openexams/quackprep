import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'semantic-ui-react';
import { selectEditState } from '@src/app/auth/authSlice';
import { selectNavbarState, toggleEdit } from '../navbarSlice';
import { selectUser } from '@src/app/auth/authSlice';

const ToggleEditComponent = () => {
  const is_creator = useSelector(selectUser).user?.is_creator;
  const page = useSelector(selectNavbarState).navbar?.page;
  const editing = useSelector(selectEditState);
  const dispatch = useDispatch();
  if (!is_creator || !page?.includes('class')) {
    return null;
  }
  return (
    <div id={'toggle_edit_comp'} style={{ color: editing ? 'green' : 'red', padding: '20px', maxWidth: '300px', margin: 'auto' }}>
      <p>
        Toggle Edit: {editing ? 'True' : 'False'}
        <Checkbox style={{ backgroundColor: 'black' }} toggle checked={editing} onChange={() => dispatch(toggleEdit())} />
      </p>
    </div>
  );
};

export default ToggleEditComponent;
