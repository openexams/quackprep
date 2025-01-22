import { Message, Icon } from 'semantic-ui-react';

export default function NoItemsFound({ title, message }) {
  return (
    <Message icon warning>
      <Icon name='info circle' />
      <Message.Content>
        <Message.Header>No {title || 'Items'} Found</Message.Header>
        {message || `${title || 'Items'} may have been moved or deleted.`}
      </Message.Content>
    </Message>
  );
}
