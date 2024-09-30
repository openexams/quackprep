import './class.css';
import React from 'react';
import { Container, Grid, Header, Card, Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { selectClassState } from './classSlice';
import ClassCard from './ClassCard';

const ClassList = () => {
  const { classes } = useSelector(selectClassState);

  return (
    <Container>
      <Header as='h1' textAlign='center' icon>
        <Icon name='graduation cap' />
        Available Classes
        <Header.Subheader>Choose one to begin your learning journey</Header.Subheader>
      </Header>

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
};

export default ClassList;
