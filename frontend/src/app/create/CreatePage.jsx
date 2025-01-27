import { useEffect, useRef, useState } from 'react';
import { Grid, Segment, Form, Button, Message, Header, Divider, Dropdown, Icon } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createDefaultUserClass, getClassesByUserId } from '../class/classSlice';
import { selectUser } from '../auth/authSlice';
import { selectArrayOfStateById } from 'maddox-js-funcs';
import { mapClassesToDropdown } from '../creator/forms/dropdownMappings';
import { getStartedNow } from '@app/layout/navbar/navbarSlice';
import CreateGroupByPDF from '../class/group/CreateGroupByPDF';
import { makeUserACreator } from '@app/creator/creatorSlice';
import { selectLoadingState } from '@app/store/loadingSlice';
import { use } from 'react';

export default function NewPageWrapper() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const defaultClassCreated = useRef(false);

  // Get the user ID from Redux
  const user = useSelector(selectUser).user;
  const user_id = user?.id;

  // Grab classes created by the user
  const userCreatedClasses = useSelector(selectArrayOfStateById('app.class.classes.classes', 'created_by', parseInt(user_id)));
  const loading = useSelector(selectLoadingState).loadingComps.CreatePage;

  // Local state for the selected class
  const [classId, setClassId] = useState(null);

  useEffect(() => {
    if (user_id && user?.is_creator) {
      dispatch(getClassesByUserId());
    }
  }, [user?.is_creator, user_id, dispatch]);

  useEffect(() => {
    if (user_id && !user?.is_creator) {
      dispatch(makeUserACreator());
    } else if (
      !loading &&
      user?.is_creator &&
      defaultClassCreated.current === false &&
      user_id &&
      Array.isArray(userCreatedClasses) &&
      userCreatedClasses.length === 0
    ) {
      defaultClassCreated.current = true;
      dispatch(createDefaultUserClass());
    }
  }, [user_id, dispatch, userCreatedClasses, user?.is_creator, loading]);

  return (
    <Segment raised padded loading={loading}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <Header as='h2'>
              <Icon name='tasks' />
              <Header.Content>
                AI Content Generation
                <Header.Subheader>Quickly generate and organize content for your classes</Header.Subheader>
              </Header.Content>
            </Header>
            <Divider />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            {/* If user has no classes, show a warning message */}
            {!userCreatedClasses || userCreatedClasses.length === 0 ? (
              <Message warning>
                <Message.Header>No Classes Found</Message.Header>
                <p>
                  You need to create a class before using the AI generation feature. This ensures you can properly organize the
                  content generated.
                </p>
                <Button primary onClick={() => dispatch(getStartedNow(navigate))}>
                  <Icon name='plus' />
                  Create Your First Class
                </Button>
              </Message>
            ) : (
              <>
                <Message info>
                  <Message.Header>Select a Class to Add Content</Message.Header>
                  <p>Choose one of your existing classes to generate and manage new content with AI.</p>
                </Message>
                <Form>
                  <Form.Field
                    search
                    control={Dropdown}
                    label='Select a Class'
                    required
                    selection
                    clearable
                    value={classId}
                    onChange={(_, data) => setClassId(data.value)}
                    options={mapClassesToDropdown(userCreatedClasses)}
                    placeholder='Select a Class'
                    fluid
                  />
                </Form>

                <Divider />

                {/* 
                  You can either disable CreateGroupByPDF until a class is selected 
                  or handle the "null" classId inside CreateGroupByPDF itself. 
                */}
                <Segment color='blue' padded>
                  {classId ? (
                    <CreateGroupByPDF classId={classId} />
                  ) : (
                    <Message warning>
                      <Message.Header>No Class Selected</Message.Header>
                      <p>Please select a class from the dropdown above to enable AI content generation.</p>
                    </Message>
                  )}
                </Segment>
              </>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
}
