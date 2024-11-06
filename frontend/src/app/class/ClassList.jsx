import './class.css';
import React, { useState } from 'react';
import { Container, Grid, GridColumn, Header, Icon, Segment } from 'semantic-ui-react';

import ClassCard from './ClassCard';
import ClassEdit from './ClassEdit';

export default function ClassList({ classes, editMode }) {
  return (
    <Grid columns={3} stackable doubling centered style={{ marginTop: '.3rem', width: '80%' }}>
      {classes &&
        classes.map((cl) => (
          <Grid.Column key={cl.id}>
            {editMode ? (
              <ClassEdit
                key={cl.id}
                name={cl.name}
                description={cl.description}
                category={cl.category}
                school_id={cl.school_id}
                id={cl.id}
              />
            ) : (
              <ClassCard key={cl.id} name={cl.name} desc={cl.description} category={cl.category} id={cl.id} />
            )}
          </Grid.Column>
        ))}
      {editMode && ( // do one extra for class edit, meaning there will be a null class that can be added
        <GridColumn>
          <ClassEdit />
        </GridColumn>
      )}
    </Grid>
  );
}
