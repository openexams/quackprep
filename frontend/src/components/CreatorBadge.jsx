import React from 'react';
import { Label, Icon } from 'semantic-ui-react';

const CreatorBadge = () => {
  return (
    <Label color='teal' basic>
      <Icon name='star' />
      Creator
    </Label>
  );
};

export default CreatorBadge;
