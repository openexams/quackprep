import { useEffect, useRef, useState } from 'react';
import { Grid, Segment, Form, Button, Message, Header, Divider, Dropdown, Icon, Container } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createDefaultUserClass, getClassesByUserId } from '@app/class/classSlice';
import { selectUser } from '@app/auth/authSlice';
import { selectArrayOfStateById } from 'maddox-js-funcs';
import { mapClassesToDropdown } from '@app/creator/forms/dropdownMappings';
import { changeNavbarPage, getStartedNow } from '@app/layout/navbar/navbarSlice';
import CreateGroupByPDF from '@app/class/group/CreateGroupByPDF';
import { makeUserACreator } from '@app/creator/creatorSlice';
import { selectLoadingState } from '@app/store/loadingSlice';

export default function CreatePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const defaultClassCreated = useRef(false);
  const haveGottenClassesByUserId = useRef(false);

  // Get the user ID from Redux
  const user = useSelector(selectUser).user;
  const user_id = user?.id;

  // Grab classes created by the user
  const userCreatedClasses = useSelector(selectArrayOfStateById('app.class.classes.classes', 'created_by', parseInt(user_id)));
  const loading = useSelector(selectLoadingState).loadingComps.Create;

  // Local state for the selected class
  const [classId, setClassId] = useState(null);

  useEffect(() => {
    if (user_id && user?.is_creator && !haveGottenClassesByUserId.current) {
      dispatch(getClassesByUserId());
      haveGottenClassesByUserId.current = true; // could be kept in redux as well
    }
  }, [user?.is_creator, user_id, dispatch]);

  const shouldCreateDefaultClass =
    haveGottenClassesByUserId.current &&
    !loading &&
    user?.is_creator &&
    !defaultClassCreated.current &&
    user_id &&
    Array.isArray(userCreatedClasses) &&
    userCreatedClasses.length === 0;

  useEffect(() => {
    if (user_id && !user?.is_creator && !loading) {
      console.log('making user a creator');
      dispatch(makeUserACreator());
    } else if (shouldCreateDefaultClass) {
      defaultClassCreated.current = true;
      console.log('creating default class for user!');
      dispatch(createDefaultUserClass());
    }
  }, [user_id, dispatch, user?.is_creator, loading, shouldCreateDefaultClass]);

  return (
    <Container style={{ minHeight: '60vh' }}>
      <Segment raised padded loading={loading}>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column>
              <Header as='h2'>
                <Icon name='tasks' />
                <Header.Content>
                  AI Exam Parser
                  <Header.Subheader>
                    Add past exams and topics to the content bank to study smarter and help others do the same.
                  </Header.Subheader>
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
                    <p>
                      Choose one of your existing classes to generate and manage new content with AI.<br></br> Dont know how to
                      make a class?{' '}
                      <a
                        style={{ color: 'blue', cursor: 'pointer' }}
                        onClick={() => dispatch(changeNavbarPage(navigate, '/creatordashboard'))}
                      >
                        <u>Click here</u>
                      </a>
                    </p>
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
    </Container>
  );
}
