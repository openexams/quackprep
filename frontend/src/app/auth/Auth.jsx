import { useEffect, useState } from 'react';
import { Header, Button, Segment, Icon, Image, Form, Grid } from 'semantic-ui-react';
import Login from './login/Login';
import { changeNavbarPage, selectLastPage } from '@app/layout/navbar/navbarSlice';
import Register from './register/register';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from './authSlice';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';

import { selectLoadingState } from '../store/loadingSlice';

export default function Auth() {
  const navigate = useNavigate();
  const loading = useSelector(selectLoadingState).loadingComps?.AuthPopup;
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const [loggingIn, setLoggingIn] = useState(true);
  const logOrSignText = loggingIn ? 'Login' : 'Sign Up';
  const lastPage = useSelector(selectLastPage).lastPage;

  useEffect(() => {
    console.log('lastPage', lastPage);
    if (user?.id && lastPage) dispatch(changeNavbarPage(navigate, lastPage));
    else if (user?.id) dispatch(changeNavbarPage(navigate, '/'));
  }, [user, navigate, dispatch]);

  if (!user.id) {
    return (
      <Segment basic loading={loading}>
        <Grid textAlign='center' verticalAlign='middle' style={{ minHeight: '80vh' }}>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Segment raised>
              <Image size='small' src='/img/quackprep_logo.webp' alt='Site Logo' centered style={{ marginBottom: '1rem' }} />
              <Header as='h2' textAlign='center' style={{ fontSize: '1.8rem' }}>
                Welcome to <span style={{ color: 'var(--primary-color)' }}>QuackPrep</span>
              </Header>
              <div style={{ fontSize: '1rem', color: '#555' }}>
                <strong style={{ marginBottom: '1rem', display: 'block' }}>Login or Sign Up to Continue. </strong>

                <section>
                  <h4 style={{ marginBottom: '-.2rem', display: 'block' }}>Why Sign Up?</h4>
                  Unlock the full potential of our platform with an extensive collection of practice questions and study materials
                  tailored to your needs. Save your answers and favorite questions for easy access. Chat with our AI-powered
                  assistant for instant help. Track your stats and achievements while competing with others.
                  <p>Start your journey to success today!</p>
                </section>
              </div>
              <Form
                onSubmit={() =>
                  window.open(
                    import.meta.env.MODE === 'development' ? `/api/auth/google` : `https://api.quackprep.com/api/auth/google`,
                    '_self',
                  )
                }
              >
                <Button size='large' fluid className='google-login-button h r'>
                  <Icon name='google' className='google-login-icon' />
                  {logOrSignText} with Google
                </Button>
              </Form>
            </Segment>

            <Button.Group size='large' style={{ marginTop: '1rem' }}>
              <Button active={loggingIn} onClick={() => setLoggingIn(true)} color={loggingIn ? 'blue' : 'grey'}>
                Login
              </Button>
              <Button.Or />
              <Button active={!loggingIn} onClick={() => setLoggingIn(false)} color={!loggingIn ? 'green' : 'grey'}>
                Sign Up
              </Button>
            </Button.Group>

            <Segment basic style={{ marginTop: '2rem' }}>
              <Header>{logOrSignText}</Header>
              {loggingIn ? <Login /> : <p>email sign up temporarily disabled, please us google signUp/login</p>}
            </Segment>

            <Segment basic textAlign='center' style={{ marginTop: '2rem', color: '#888' }}>
              <p>
                By signing in, you agree to our{' '}
                <Link to='/tos' style={{ color: '#4285F4' }}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to='/privacy' style={{ color: '#4285F4' }}>
                  Privacy Policy
                </Link>
                .
              </p>
            </Segment>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  } else {
    return null;
  }
}
