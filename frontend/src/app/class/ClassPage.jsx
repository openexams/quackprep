import './class.css';
import React, { useState } from 'react';
import { Button, Accordion, Container, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import SchoolsList from './school/SchoolsList.jsx';
import { selectBINARYArrayOfStateById } from 'maddox-js-funcs.js';
import { changeNavbarPage, selectNavbarState } from '@components/navbar/navbarSlice';
import ClassList from './ClassList';
import { useNavigate } from 'react-router-dom';

export default function ClassPage() {
  const navigate = useNavigate();
  const curSchool = useSelector(selectNavbarState).navbar?.schoolId;
  const classes = useSelector(selectBINARYArrayOfStateById('app.class.classes.classes', 'school_id', curSchool));
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(false);

  return (
    <Container style={{ marginTop: '-5rem' }}>
      <Header as='h1' textAlign='center' icon>
        <Icon name='graduation cap' />
        Available Classes
        <Header.Subheader>Choose one to begin your learning journey</Header.Subheader>
      </Header>
      <SchoolsList selectedSchool={curSchool} />
      {curSchool == null ? (
        <Segment placeholder textAlign='center'>
          <Header icon>
            <Icon name='building' />
            Please Select a School
            <Header.Subheader>Choose a school from the list above to view available classes</Header.Subheader>
          </Header>
        </Segment>
      ) : (
        <Segment placeholder textAlign='center'>
          <Grid columns={3} stackable doubling centered>
            <ClassList classes={classes} />
          </Grid>
        </Segment>
      )}
      <Segment padded='very' textAlign='center' raised secondary={isActive} basic={!isActive}>
        <Accordion>
          <Accordion.Title active={isActive} onClick={() => setIsActive(!isActive)}>
            <Header as='h2'>
              <Icon name='dropdown' />
              Don't See a Class?
            </Header>
          </Accordion.Title>
          <Accordion.Content active={isActive}>
            <Header.Subheader style={{ marginBottom: '1.5em' }}>Create your own and start teaching today!</Header.Subheader>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Icon
                name='plus circle'
                size='massive'
                color='blue'
                className='pointer'
                onClick={() => dispatch(changeNavbarPage(navigate, '/creatordashboard'))}
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  fontSize: '5em',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>
          </Accordion.Content>
        </Accordion>
      </Segment>
    </Container>
  );
}
