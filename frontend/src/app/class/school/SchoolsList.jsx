import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Segment, Button, Grid } from 'semantic-ui-react';
import { selectSchoolState } from './schoolSlice';
import './school.css';
import { selectLoadingState } from '@src/app/store/loadingSlice';
import { changeNavbarPage, selectNavbarState, updateSchoolId } from '@components/navbar/navbarSlice';
import { useNavigate } from 'react-router-dom';
import { selectArrayOfIncludingItem } from 'maddox-js-funcs';

export default function SchoolsList() {
  let { schoolId: curSchoolId } = useSelector(selectNavbarState).navbar;
  let selectedSchoolId = useSelector(selectNavbarState).navbar?.schoolId;
  const navigate = useNavigate();
  const schools = useSelector(selectSchoolState).schools;
  const loading = useSelector(selectLoadingState).loadingComps?.SchoolsList;
  const dispatch = useDispatch();

  // set local school on every change
  useEffect(() => {
    if (curSchoolId) {
      localStorage.setItem('schoolId', curSchoolId);
      curSchoolId = parseInt(curSchoolId);
    }
  }, [curSchoolId]);

  // get local school at start
  useEffect(() => {
    let tmp;
    if (schools && (tmp = localStorage.getItem('schoolId')) && tmp != null) {
      const wanted_school = selectArrayOfIncludingItem(schools, 'id', tmp)?.[0];
      if (wanted_school) {
        dispatch(changeNavbarPage(navigate, `/class/${wanted_school?.school_name}`));
      }
    } else if (schools) {
      updateSchoolId(4);
      dispatch(changeNavbarPage(navigate, '/class/General'));
    }
  }, [schools, dispatch, navigate]); // could be risky idk

  return (
    <Segment loading={loading}>
      <Grid columns={8} doubling>
        {schools?.map((school) => (
          <Grid.Column key={'s' + school.id}>
            <Button
              className={`school-button ${selectedSchoolId === school.id ? 'selected' : ''}`}
              size='small'
              fluid
              basic={selectedSchoolId !== school.id}
              onClick={() => {
                dispatch(changeNavbarPage(navigate, `/class/${school.school_name}`));
                // bad pratice assuming class before it but works
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
  if (!color) {
    return 0;
  }
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};
