import { Message, Icon } from 'semantic-ui-react';

export default function NoItemsFound({ title }) {
  return (
    <Message icon warning>
      <Icon name='info circle' />
      <Message.Content>
        <Message.Header>No {title || 'Items'} Found</Message.Header>
        {`${title || 'Items'} may have been deleted or moved.\n Please contact support for further assistance.`}
      </Message.Content>
    </Message>
  );
}
