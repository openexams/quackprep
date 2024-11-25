import './class.css';
import React, { useState } from 'react';
import { Container, Grid, Header, Segment, Divider, Icon } from 'semantic-ui-react';

import ClassCard from './ClassCard';
import { useSelector } from 'react-redux';
import { selectClassCategories } from './class_categories/classCategorySlice';

function selectClassesWithCategory(classes, selectedCategory) {
  if (!Array.isArray(classes) || !selectedCategory) {
    return classes;
  }
  const ret = [];
  for (let i = 0; i < classes.length; i++) {
    if (classes[i]?.category === selectedCategory) {
      ret.push(classes[i]);
    }
  }
  return ret;
}

function mapClassesToCategories(classes, classCategories) {
  const ret = [];

  for (let i = 0; i < classCategories.length; i++) {
    const curClasses = selectClassesWithCategory(classes, classCategories[i]?.id);
    if (!curClasses || curClasses?.length === 0) {
      continue;
    }

    ret.push(
      <Segment basic padded key={classCategories[i]?.id}>
        <Header as='h2' textAlign='center' content={classCategories[i]?.name} />
        <Grid columns={3} stackable doubling centered>
          {curClasses.map((cl) => (
            <Grid.Column key={cl.id}>
              <Segment basic>
                <ClassCard name={cl.name} desc={cl.description} category={cl.category} id={cl.id} />
              </Segment>
            </Grid.Column>
          ))}
        </Grid>
        <Divider />
      </Segment>,
    );
  }
  return ret;
}

export default function ClassList({ classes }) {
  const classCategories = useSelector(selectClassCategories).class_categories;

  return <Container>{classes && mapClassesToCategories(classes, classCategories)}</Container>;
}
