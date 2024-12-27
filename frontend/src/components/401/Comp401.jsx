import { useDispatch, useSelector } from 'react-redux';
import { changeNavbarPage, selectNavbarState } from '../navbar/navbarSlice';
import { hide401Msg, select401CompState } from './401Slice';
import { Button, Modal, TransitionablePortal, Icon } from 'semantic-ui-react';
import './Comp401.css';
import { useNavigate } from 'react-router-dom';

export default function Comp401() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const show = useSelector(select401CompState).show;

  if (!show) return null;

  const handleClose = () => {
    dispatch(hide401Msg());
    //dispatch(changeNavbarPage(navigate, '/home'));
  };

  const handleSignIn = () => {
    dispatch(hide401Msg());
    dispatch(changeNavbarPage(navigate, `/auth`));
  };

  return (
    <TransitionablePortal open={show} transition={{ animation: 'scale', duration: 300 }}>
      <Modal
        open={true}
        onClose={handleClose}
        size='tiny'
        className='modern-modal'
        // Instead of closeIcon boolean, provide a custom icon component:
        closeIcon={
          <Icon
            color='black'
            name='close'
            size='massive'
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              cursor: 'pointer',
            }}
            onClick={handleClose}
          />
        }
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        }}
      >
        <Modal.Header
          style={{
            background: '#f8f9fa',
            borderBottom: '1px solid #e9ecef',
            padding: '1.5rem',
            fontSize: '1.5rem',
            fontWeight: '600',
          }}
        >
          <Icon name='lock' style={{ marginRight: '10px' }} />
          Access Restricted
        </Modal.Header>

        <Modal.Content style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <Icon
              name='user circle'
              size='huge'
              style={{
                color: '#6c757d',
                marginBottom: '1rem',
              }}
            />
            <p
              style={{
                fontSize: '1.1rem',
                color: '#495057',
                marginBottom: '1.5rem',
                lineHeight: '1.5',
              }}
            >
              Please sign in to access this content.
            </p>

            <Button
              primary
              size='large'
              fluid
              onClick={handleSignIn}
              style={{
                background: '#0d6efd',
                padding: '0.8rem',
                fontWeight: '500',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              }}
              className='hover-effect'
            >
              <Icon name='sign-in' />
              Sign In Now
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    </TransitionablePortal>
  );
}
