import './class.css';
import React, { useState } from 'react';
import { Container, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import SchoolsList from './school/SchoolsList.jsx';
import { selectArrayOfStateById } from '@utils/functions';
import { selectNavbarState } from '@components/navbar/navbarSlice';
import ClassList from './ClassList';

export default function ClassPage() {
  const curSchool = useSelector(selectNavbarState).navbar?.schoolId;
  const classes = useSelector(selectArrayOfStateById('app.class.classes', 'school_id', curSchool));

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
          <Grid columns={3} stackable doubling centered style={{ marginTop: '.3rem' }}>
            <ClassList classes={classes} />
          </Grid>
        </Segment>
      )}
    </Container>
  );
}
