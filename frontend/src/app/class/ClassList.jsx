import './class.css';
import React, { useState } from 'react';
import { Container, Grid, GridColumn, Header, Icon, Segment } from 'semantic-ui-react';

import ClassCard from './ClassCard';

export default function ClassList({ classes }) {
  return (
    <Grid columns={3} stackable doubling centered style={{ marginTop: '.3rem', width: '80%' }}>
      {classes &&
        classes.map((cl) => (
          <Grid.Column key={cl.id}>
            <ClassCard key={cl.id} name={cl.name} desc={cl.description} category={cl.category} id={cl.id} />
          </Grid.Column>
        ))}
    </Grid>
  );
}
