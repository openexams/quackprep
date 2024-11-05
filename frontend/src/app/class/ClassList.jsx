import './class.css';
import React, { useState } from 'react';
import { Container, Grid, Header, Icon, Segment } from 'semantic-ui-react';

import ClassCard from './ClassCard';

export default function ClassList({ classes }) {
  return (
    <Grid columns={3} stackable doubling centered style={{ marginTop: '.3rem' }}>
      {classes &&
        classes.map((cl) => (
          <Grid.Column key={cl.id}>
            <ClassCard name={cl.name} desc={cl.description} category={cl.category} id={cl.id} />
          </Grid.Column>
        ))}
    </Grid>
  );
}
