import { Segment, Header, Icon, Button, Grid } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { changeNavbarPage } from '@src/app/layout/navbarSlice';

/**
 * Show a component message that the user must be logged in to access a certain page.
 * @param {*} param0
 * @returns
 */
export default function LoginRequired({ title }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Segment basic>
      <Grid>
        <Grid.Column>
          <Segment raised>
            <Icon name='lock' size='huge' color='red' style={{ marginBottom: '1rem' }} />
            <Header as='h2' textAlign='center' style={{ fontSize: '1.8rem' }}>
              You must be logged in to access <span style={{ color: 'var(--primary-color)' }}>{title}</span>
            </Header>
            <p style={{ fontSize: '1rem', color: '#555' }}>
              Please log in or sign up to continue and enjoy all the features our platform has to offer.
            </p>
          </Segment>
          <Button onClick={() => dispatch(changeNavbarPage(navigate, `/auth`))}>Login Now</Button>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}
