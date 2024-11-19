import { Button, Message, Transition } from 'semantic-ui-react';
import { hideFlashMessage, selectFlashMessageState } from './flashMessageSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { changeNavbarPage, selectNavbarState } from '@components/navbar/navbarSlice.js';

const messageStyles = {
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    borderColor: '#c3e6cb',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderColor: '#f5c6cb',
  },
};

const baseMessageStyle = {
  position: 'fixed',
  top: '100px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  minWidth: '50%',
  maxWidth: '90%',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
  padding: '1rem',
  borderRadius: '0.5rem',
};

const closeButtonStyle = {
  position: 'relative',
  float: 'right',
  backgroundColor: 'transparent',
  border: 'none',
  boxShadow: 'none',
  cursor: 'pointer',
  padding: '7px',
  margin: '3px',
  zIndex: 10,
};

export default function FlashMessage() {
  const dispatch = useDispatch();
  const { page } = useSelector(selectNavbarState).navbar;
  const { show, error, msg } = useSelector(selectFlashMessageState);

  // Auto-hide message after 4 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        dispatch(hideFlashMessage());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, dispatch]);

  return (
    <Transition visible={show} animation='fade' duration={500}>
      <Message
        floating
        error={Boolean(error)}
        style={{
          ...baseMessageStyle,
          ...(error ? messageStyles.error : messageStyles.success),
        }}
      >
        <Button
          icon='close'
          onClick={() => dispatch(hideFlashMessage())}
          size='big'
          style={{
            ...closeButtonStyle,
            color: error ? messageStyles.error.color : messageStyles.success.color,
          }}
        />
        <Message.Header style={{ fontWeight: 'bold' }}>{error ? 'An Error Has Occurred' : 'Success!'}</Message.Header>
        <p style={{ position: 'relative', zIndex: 1, margin: 0 }}>
          {msg} {error && `: ${error.toString()}`}
        </p>
      </Message>
    </Transition>
  );
}
