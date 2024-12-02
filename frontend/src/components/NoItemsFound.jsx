import React from 'react';
import { Message, Icon } from 'semantic-ui-react';

export default function NoItemsFound() {
  return (
    <Message icon warning>
      <Icon name='info circle' />
      <Message.Content>
        <Message.Header>No Items Found</Message.Header>
        Please contact support for further assistance.
      </Message.Content>
    </Message>
  );
}
