import { useEffect, useState } from 'react';
import { Modal, Button, Segment, Header, Icon, Image, Form } from 'semantic-ui-react';
import Login from './login/Login';
import { changeNavbarPage, selectCurrentPage } from '@components/navbar/navbarSlice';
import Register from './register/register';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from './authSlice';
import google_icon from '/img/google_icon.webp';
import { useSearchParams } from 'react-router-dom';

export default function Auth() {
  const loading = useSelector((state) => state.loading.loadingComps.AuthPopup);
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const [open, setOpen] = useState(true);
  const [loggingIn, setLoggingIn] = useState(true);
  const log_or_sin_txt = loggingIn ? 'Login' : 'Sign Up';

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (user?.id && searchParams.has('next')) dispatch(changeNavbarPage(searchParams.get('next')));
    else if (user?.id) dispatch(changeNavbarPage('/profile'));
  }, [user]);

  if (!user.id) {
    return (
      <Modal
        closeIcon
        open={open}
        onClose={() => {
          setOpen(false);
          dispatch(changeNavbarPage('/home'));
        }}
        size='tiny'
        style={{ backgroundColor: '#f7f7ff', zIndex: 2 }}
      >
        <Segment style={{ minHeight: 650 }} basic loading={loading}>
          <Modal.Header style={{ textAlign: 'center', backgroundColor: '#6A0DAD', color: '#fff', padding: '20px' }}>
            <Header as='h2' inverted>
              <Icon name='user' />

              <Header.Content>
                {log_or_sin_txt} to Your Account
                <Header.Subheader style={{ color: '#ddd' }}>Welcome to quackprep</Header.Subheader>
              </Header.Content>
            </Header>
          </Modal.Header>
          <Modal.Content style={{ textAlign: 'center' }}>
            <Form onSubmit={() => window.open(`${BACKEND_URL}/api/auth/google`)}>
              <Button
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid lightgrey',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <strong>{log_or_sin_txt} with Google</strong>
                <Image src={google_icon} style={{ maxWidth: '20px' }} />
              </Button>
            </Form>
            <br></br>
            <Button.Group>
              <Button active={loggingIn} onClick={() => setLoggingIn(true)} color={loggingIn ? 'purple' : 'grey'} size='large'>
                Login
              </Button>
              <Button.Or />
              <Button active={!loggingIn} onClick={() => setLoggingIn(false)} color={!loggingIn ? 'purple' : 'grey'} size='large'>
                Sign Up
              </Button>
            </Button.Group>
            <Segment style={{ marginTop: '20px', padding: '20px' }}>{loggingIn ? <Login /> : <Register />}</Segment>
          </Modal.Content>
        </Segment>
      </Modal>
    );
  } else {
    return null;
  }
}
