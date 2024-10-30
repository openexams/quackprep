import './class.css';
import React, { useState } from 'react';
import { Container, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import ClassCard from './ClassCard';
import SchoolsList from './school/SchoolsList.jsx';
import { selectArrayOfStateById } from '@utils/functions';
import { selectNavbarState } from '@components/navbar/navbarSlice';

export default function ClassList() {
  const curSchool = useSelector(selectNavbarState).navbar?.schoolName;
  const curSchoolId = useSelector(selectArrayOfStateById('app.school.schools', 'school_name', curSchool))?.[0].id;
  const classes = useSelector(selectArrayOfStateById('app.class.classes', 'school_id', curSchoolId));

  return (
    <Container>
      <Header as='h1' textAlign='center' icon>
        <Icon name='graduation cap' />
        Available Classes
        <Header.Subheader>Choose one to begin your learning journey</Header.Subheader>
      </Header>
      <SchoolsList selectedSchool={curSchoolId} />
      {curSchoolId == null ? (
        <Segment placeholder textAlign='center'>
          <Header icon>
            <Icon name='building' />
            Please Select a School
            <Header.Subheader>Choose a school from the list above to view available classes</Header.Subheader>
          </Header>
        </Segment>
      ) : (
        <Segment placeholder textAlign='center'>
          <Grid columns={3} stackable doubling centered style={{ marginTop: '2rem' }}>
            {classes &&
              classes.map((cl) => (
                <Grid.Column key={cl.id}>
                  <ClassCard name={cl.name} desc={cl.description} category={cl.category} id={cl.id} />
                </Grid.Column>
              ))}
          </Grid>
        </Segment>
      )}
    </Container>
  );
}
