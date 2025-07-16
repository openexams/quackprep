import { Card, Button, Icon } from 'semantic-ui-react';
import { turnUnderscoreIntoSpace } from 'maddox-js-funcs';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentGroupData, changeNavbarPage, selectNavbarState } from '@app/layout/navbar/navbarSlice';
import { selectCanAndIsEdit } from '@app/auth/authSlice';
import GroupEditor from '@app/creator/forms/GroupEdit';
export default function GroupCard({ id, name, class_id, description, created_by, type, school_id, school_name }) {
  const edit = useSelector(selectCanAndIsEdit());
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (edit) {
    return <GroupEditor id={id} name={name} description={description} class_id={class_id} created_by={created_by} type={type} />;
  }
  return (
    <Card id={`group_${id}_card`} key={id} raised>
      <Card.Content>
        <Card.Meta style={{ fontSize: '0.8em', color: 'grey' }}>{turnUnderscoreIntoSpace(school_name)}</Card.Meta>
        <Card.Header>{turnUnderscoreIntoSpace(name)}</Card.Header>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button
          fluid
          color='blue'
          onClick={() => {
            dispatch(updateCurrentGroupData(id, name));
            dispatch(changeNavbarPage(navigate, `/class/${school_name}/${class_id}/group/${id}/question`)); // /group may cause issues
          }}
        >
          <Icon name='fork' />
          Study Group
        </Button>
      </Card.Content>
    </Card>
  );
}
