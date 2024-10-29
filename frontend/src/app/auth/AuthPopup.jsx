import { useEffect, useState } from 'react';
import { Modal, Button, Segment, Header, Icon, Image, Form } from 'semantic-ui-react';
import Login from './login/Login';
import { changeNavbarPage, selectNavbarState } from '@components/navbar/navbarSlice';
import Register from './register/register';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from './authSlice';
import google_icon from '/img/google_icon.webp';
import { useSearchParams } from 'react-router-dom';

export default function Auth() {
  const linkAfterAuthNext = useSelector(selectNavbarState).navbar.page?.split('/auth?next=')?.[1];
  const loading = useSelector((state) => state.loading.loadingComps.AuthPopup);
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const [open, setOpen] = useState(true);
  const [loggingIn, setLoggingIn] = useState(true);
  const log_or_sin_txt = loggingIn ? 'Login' : 'Sign Up';

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (user?.id && searchParams.has('next')) dispatch(changeNavbarPage(searchParams.get('next')));
    else if (user?.id) dispatch(changeNavbarPage('/home'));
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
          <Modal.Header style={{ textAlign: 'center', backgroundColor: 'black', padding: '20px', marginBottom: '1em' }}>
            <Header as='h2' inverted style={{ marginBottom: '.5em' }}>
              <Icon name='user' />

              <Header.Content>
                {log_or_sin_txt} to Your Account
                <Header.Subheader style={{ color: '#ddd' }}>Welcome to quackprep</Header.Subheader>
                {linkAfterAuthNext && (
                  <Header.Subheader style={{ color: '#ddd' }}>
                    You must be logged in to use **{linkAfterAuthNext}**
                  </Header.Subheader>
                )}
              </Header.Content>
            </Header>
          </Modal.Header>
          <Modal.Content style={{ textAlign: 'center' }}>
            <Form onSubmit={() => window.open(`/api/auth/google`)}>
              {/** may be why google no work , all work and no play makes maddox a dull boy*/}
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
                <Image src={google_icon} style={{ maxWidth: '20px' }} /> <span style={{ fontSize: '.8rem' }}>(Recommended)</span>
              </Button>
            </Form>
            <br></br>
            <Button.Group>
              <Button active={loggingIn} onClick={() => setLoggingIn(true)} color={loggingIn ? 'grey' : 'grey'} size='large'>
                Login
              </Button>
              <Button.Or />
              <Button active={!loggingIn} onClick={() => setLoggingIn(false)} color={!loggingIn ? 'purple' : 'grey'} size='large'>
                Sign Up{/* change button class name depending on if active or not, since semantic ui / me ovverides the color. */}
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
