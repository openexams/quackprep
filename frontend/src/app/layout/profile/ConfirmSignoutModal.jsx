import React from 'react';
import { Modal, Button, Icon, Header } from 'semantic-ui-react';

export default function ConfirmSignoutModal({ open, onSubmit, onClose }) {
  return (
    <Modal size='tiny' open={open} onClose={() => onClose()} closeIcon>
      <Header icon='sign-out' content='Confirm Sign Out' />
      <Modal.Content>
        <p>Are you sure you want to sign out? You'll need to sign in again to access your account.</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color='grey' onClick={() => onClose()}>
          <Icon name='cancel' /> Cancel
        </Button>
        <Button color='red' onClick={() => onSubmit()}>
          <Icon name='sign-out' /> Sign Out
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
