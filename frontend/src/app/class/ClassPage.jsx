import './class.css';
import { Container, Header, Icon, Segment } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import SchoolsList from './school/SchoolsList.jsx';
import { selectNavbarState } from '@app/layout/navbar/navbarSlice';
import ClassList from './ClassList';
import ClassAnchorCTA from './class_cta/ClassAnchorCTA';

export default function ClassPage() {
  let { schoolId: curSchoolId } = useSelector(selectNavbarState).navbar;

  return (
    <Container fluid style={{ padding: '0px' }}>
      <Header as='h1' textAlign='center' icon={'graduation cap'}>
        {curSchoolId ? 'Available Classes' : 'Choose a School'}
        <Header.Subheader>Choose one to begin your learning journey</Header.Subheader>
      </Header>
      <SchoolsList />
      {curSchoolId == null ? (
        <Segment placeholder textAlign='center' style={{ marginTop: 0 }}>
          <Header icon>
            <Icon name='building' />
            Please Select a School
            <Header.Subheader>Choose a school from the list above to view available classes</Header.Subheader>
          </Header>
        </Segment>
      ) : (
        <Segment placeholder textAlign='center' style={{ marginTop: 0 }}>
          <ClassList />
        </Segment>
      )}
      <ClassAnchorCTA />
    </Container>
  );
}
