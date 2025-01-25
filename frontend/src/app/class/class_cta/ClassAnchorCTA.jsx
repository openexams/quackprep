import { Segment, Icon, Header, Accordion } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { changeNavbarPage } from '@app/layout/navbar/navbarSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
export default function ClassAnchorCTA() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(false);
  return (
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
  );
}
