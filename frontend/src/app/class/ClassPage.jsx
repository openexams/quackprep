import './class.css';
import { useState } from 'react';
import { Accordion, Container, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import SchoolsList from './school/SchoolsList.jsx';
import { changeNavbarPage, selectNavbarState } from '@src/app/layout/navbarSlice';
import ClassList from './ClassList';
import { useNavigate } from 'react-router-dom';

export default function ClassPage() {
  let { schoolId: curSchoolId } = useSelector(selectNavbarState).navbar;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(false);

  return (
    <Container fluid style={{ marginTop: '-7rem', padding: '2rem' }}>
      <Header as='h1' textAlign='left' icon={'graduation cap'}>
        Available Classes
        <Header.Subheader>Choose one to begin your learning journey</Header.Subheader>
      </Header>
      <SchoolsList />
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
          <ClassList />
        </Segment>
      )}
      <Segment padded='very' textAlign='center' raised secondary={isActive} basic={!isActive}>
        <Accordion>
          <Accordion.Title active={isActive} onClick={() => setIsActive(!isActive)}>
            <Header as='h2'>
              <Icon name='dropdown' />
              Don't See a Class?
            </Header>
          </Accordion.Title>
          <Accordion.Content active={isActive}>
            <Header.Subheader style={{ marginBottom: '1.5em' }}>Create your own and start teaching today!</Header.Subheader>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Icon
                name='plus circle'
                size='massive'
                color='blue'
                className='pointer'
                onClick={() => dispatch(changeNavbarPage(navigate, '/creatordashboard'))}
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  fontSize: '5em',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>
          </Accordion.Content>
        </Accordion>
      </Segment>
    </Container>
  );
}
