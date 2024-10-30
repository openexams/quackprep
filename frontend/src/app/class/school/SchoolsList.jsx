import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Segment, Button, Grid } from 'semantic-ui-react';
import { selectSchoolState } from './schoolSlice';
import './school.css';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import { changeNavbarPage } from '@components/navbar/navbarSlice';

export default function SchoolsList({ selectedSchool }) {
  const schools = useSelector(selectSchoolState).schools;
  const loading = useSelector(selectLoadingState).loadingComps?.SchoolsList;
  const dispatch = useDispatch();

  return (
    <Segment loading={loading}>
      <Grid columns={8} doubling>
        {schools?.map((school) => (
          <Grid.Column key={school.id}>
            <Button
              className={`school-button ${selectedSchool === school.id ? 'selected' : ''}`}
              size='small'
              fluid
              basic={selectedSchool !== school.id}
              onClick={() => {
                dispatch(changeNavbarPage(`/class/${school.school_name}`)); // bad pratice assuming class before it but works
              }}
              style={{
                marginBottom: '0.5em',
                '--school-bg-color': school.color, // good ex of ovveriding !important i think the class takes in vars from this
                '--school-text-color': isLightColor(school.color) ? 'black' : 'white',
              }}
            >
              {school.school_name}
            </Button>
          </Grid.Column>
        ))}
      </Grid>
    </Segment>
  );
}

// Helper function to determine if text should be dark or light based on background
const isLightColor = (color) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};
