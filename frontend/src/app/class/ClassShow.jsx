import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Segment, Header, Button, Icon, Grid, Divider } from 'semantic-ui-react';
import { selectClassStateByName } from './classSlice';
import { changeNavbarPage } from '@components/navbar/navbarSlice';

export default function ClassShow() {
  const dispatch = useDispatch();
  const { class_name: name } = useParams();
  const { classes: curClass } = useSelector(selectClassStateByName(name));

  if (!curClass) return null;

  return (
    <Container>
      <Segment basic raised>
        <Header as='h1' textAlign='center' color='blue'>
          <Header.Content>
            {curClass.name}
            <Header.Subheader>Category: {curClass.category}</Header.Subheader>
          </Header.Content>
        </Header>

        <Divider horizontal>
          <Header as='h4'>
            <Icon name='tag' />
            Class Description
          </Header>
        </Divider>

        <p style={{ fontSize: '1.1em', lineHeight: '1.5', textAlign: 'center' }}>{curClass.description}</p>

        <Divider horizontal>
          <Header as='h4'>
            <Icon name='book' />
            Study Options
          </Header>
        </Divider>

        <Grid centered stackable columns={2}>
          <Grid.Column textAlign='center'>
            <Button size='large' color='teal' onClick={() => dispatch(changeNavbarPage('topic'))}>
              <Icon name='list' />
              Study by Topic
            </Button>
          </Grid.Column>
          <Grid.Column textAlign='center'>
            <Button size='large' color='green' disabled>
              <Icon name='tasks' />
              Study by Difficulty <span style={{ fontSize: '.7rem' }}>coming soon...</span>
            </Button>
          </Grid.Column>
          <Grid.Column textAlign='center'>
            <Button size='large' color='teal' onClick={() => dispatch(changeNavbarPage('exam'))}>
              {/* TODO list exams*/}
              <Icon name='list' />
              Study by Exam
            </Button>
          </Grid.Column>
        </Grid>
      </Segment>
    </Container>
  );
}
