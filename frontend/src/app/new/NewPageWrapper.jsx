import { Dropdown, Segment, Form, Button, Message, Dimmer } from 'semantic-ui-react';
import CreateGroupByPDF from '../class/group/CreateGroupByPDF';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClassesByUserId } from '../class/classSlice';
import { selectUser } from '../auth/authSlice';
import { selectArrayOfStateById } from 'maddox-js-funcs';
import { mapClassesToDropdown } from '../creator/forms/dropdownMappings';
import { changeNavbarPage } from '@components/navbar/navbarSlice';
import { useNavigate } from 'react-router-dom';

export default function NewPageWrapper() {
  // Get all classes made by user
  const user_id = useSelector(selectUser).user?.id;
  const dispatch = useDispatch();
  const classes = useSelector(selectArrayOfStateById('app.class.classes.classes', 'created_by', parseInt(user_id)));
  const [classId, setClassId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user_id) {
      dispatch(getClassesByUserId());
    }
  }, [user_id]);

  const handleCreateClass = () => {
    dispatch(changeNavbarPage(navigate, '/creatordashboard'));
  };

  return (
    <Segment style={{ minHeight: '60vh' }} basic>
      {classes?.length === 0 && (
        <Message warning>
          <Message.Header>No Classes Found</Message.Header>
          <p>
            You need to create a class before using the AI generation feature. This will help you organize and generate content
            for your specific educational needs.
          </p>
          <Button primary onClick={handleCreateClass}>
            Create Your First Class
          </Button>
        </Message>
      )}
      {classes?.length > 0 && (
        <Form>
          <Form.Field
            control={Dropdown}
            label='Select a Class to Add Content To'
            required
            selection
            clearable
            value={classId}
            onChange={(_, data) => setClassId(data.value)}
            options={mapClassesToDropdown(classes)}
            placeholder='Select a Class'
          />
        </Form>
      )}
      {classes?.length > 0 && <CreateGroupByPDF classId={classId} />} {/* should dim this until classId is choosen */}
    </Segment>
  );
}
