import './class.css';
import React, { useState } from 'react';
import { Container, Grid, Header, Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import ClassCard from './ClassCard';
import SchoolsList from './school/SchoolsList.jsx';
import { selectArrayOfStateById } from '@utils/functions';

export default function ClassList() {
  const [selectedSchool, setSelectedSchool] = useState(1); // select what classes shown based on cur selected school
  const classes = useSelector(selectArrayOfStateById('app.class.classes', 'school_id', selectedSchool));

  return (
    <Container>
      <Header as='h1' textAlign='center' icon>
        <Icon name='graduation cap' />
        Available Classes
        <Header.Subheader>Choose one to begin your learning journey</Header.Subheader>
      </Header>
      <SchoolsList selectedSchool={selectedSchool} setSelectedSchool={setSelectedSchool} />
      <Grid columns={3} stackable doubling centered style={{ marginTop: '2rem' }}>
        {classes &&
          classes.map((cl) => (
            <Grid.Column key={cl.id}>
              <ClassCard name={cl.name} desc={cl.description} category={cl.category} id={cl.id} />
            </Grid.Column>
          ))}
      </Grid>
    </Container>
  );
}
