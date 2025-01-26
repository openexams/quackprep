import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, Segment, Header, Icon } from 'semantic-ui-react';
import { selectEditState } from '@app/auth/authSlice';
import { selectNavbarState, toggleEdit } from '@app/layout/navbar/navbarSlice';
import { selectUser } from '@app/auth/authSlice';

const ToggleEditComponent = () => {
  const isCreator = useSelector(selectUser).user?.is_creator;
  const currentPage = useSelector(selectNavbarState).navbar?.page;
  const isEditing = useSelector(selectEditState);
  const dispatch = useDispatch();

  if (!isCreator || !currentPage?.includes('class')) {
    return null;
  }

  // ClassEditor.jsx
  function highLightClassEditCreate() {
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

  return (
    <Segment size='mini' basic id='toggle_edit_comp' textAlign='center' style={{ maxWidth: '250px', margin: 'auto' }}>
      <Header as='h6' color={isEditing ? 'green' : 'red'} style={{ fontSize: '1rem', marginBottom: '-.2rem' }}>
        <Icon size='small' name={isEditing ? 'edit' : 'ban'} />
        {isEditing ? 'Editing Enabled' : 'Editing Disabled'}
      </Header>
      <Checkbox
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '20px', // Add this line for rounded edges
          padding: '5px', // Optional: Add some padding for better appearance
        }}
        toggle
        checked={isEditing}
        onChange={() => {
          dispatch(toggleEdit());
          setTimeout(() => highLightClassEditCreate(), 100);
        }}
        label='Toggle Edit Mode'
      />
    </Segment>
  );
};

export default ToggleEditComponent;
