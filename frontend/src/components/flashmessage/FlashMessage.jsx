import { Button, Message } from 'semantic-ui-react';
import { hideFlashMessage, selectFlashMessageState } from './flashMessageSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { changeNavbarPage, selectNavbarState } from '@components/navbar/navbarSlice.js';

export default function FlashMessage() {
  const dispatch = useDispatch();
  const { page } = useSelector(selectNavbarState).navbar;
  const { show, error, msg } = useSelector(selectFlashMessageState);

  return (
    <>
      {show && (
        <Message
          floating
          error={Boolean(error)}
          style={{
            position: 'fixed',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            minWidth: '50%',
            maxWidth: '90%',
            backgroundColor: error ? '#f8d7da' : '#d4edda',
            color: error ? '#721c24' : '#155724',
            borderColor: error ? '#f5c6cb' : '#c3e6cb',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            padding: '1rem',
            borderRadius: '0.5rem',
          }}
        >
          <Button
            icon='close'
            onClick={() => {
              dispatch(hideFlashMessage());
            }}
            size='big'
            style={{
              position: 'relative',
              float: 'right',
              backgroundColor: 'transparent',
              color: error ? '#721c24' : '#155724',
              border: 'none',
              boxShadow: 'none',
              cursor: 'pointer',
              padding: '7px',
              margin: '3px',
              zIndex: 10,
            }}
          />
          <Message.Header style={{ fontWeight: 'bold' }}>{error ? 'An Error Has Occurred' : 'Success!'}</Message.Header>
          <p style={{ position: 'relative', zIndex: 1, margin: 0 }}>
            {msg} {error && `: ${error.toString()}`}
          </p>
        </Message>
      )}
    </>
  );
}
