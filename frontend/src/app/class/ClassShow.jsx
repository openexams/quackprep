import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Segment, Header, Button, Icon, Grid, Divider, Popup } from 'semantic-ui-react';
import { changeNavbarPage, selectNavbarState } from '@components/navbar/navbarSlice';
import { selectArrayOfStateById } from '@utils/functions';
import { useNavigate } from 'react-router-dom';

export default function ClassShow() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classId } = useSelector(selectNavbarState).navbar;
  const curClass = useSelector(selectArrayOfStateById('app.class.classes.classes', 'id', classId))?.[0];

  if (!curClass) return null;
  const hasCgroups = curClass.group_id ? true : false;
  const hasPdfs = curClass.pdf_id ? true : false;
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
          {hasCgroups && (
            <>
              <Grid.Column textAlign='center'>
                <Button
                  size='large'
                  onClick={() => {
                    dispatch(changeNavbarPage(navigate, 'exam'));
                  }}
                >
                  <Icon name='list' />
                  Study by Exam
                </Button>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Button size='large' onClick={() => dispatch(changeNavbarPage(navigate, 'topic'))}>
                  <Icon name='list' />
                  Study by Topic
                </Button>
              </Grid.Column>
            </>
          )}
          {hasPdfs && (
            <Grid.Column textAlign='center'>
              <Button
                size='large'
                onClick={() => {
                  dispatch(changeNavbarPage(navigate, 'pdfs'));
                }}
              >
                <Icon name='list' />
                {'PDFs (Exams)'}
              </Button>
            </Grid.Column>
          )}
          <Grid.Column textAlign='center'>
            <Popup // does not work while button disabled
              position='top center'
              content='help'
              on='hover'
              trigger={
                <Button size='large' color='green' disabled>
                  <Icon name='tasks' />
                  AI Generated Questions <span style={{ fontSize: '.7rem' }}>coming soon...</span>
                </Button>
              }
            ></Popup>
          </Grid.Column>
        </Grid>
      </Segment>
    </Container>
  );
}
