import { useState } from 'react';
import { List, Icon, Button } from 'semantic-ui-react';
import ConfirmButton from './ConfirmButton';

const EditableListItem = ({ text, onEdit, onDelete, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <List.Item
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}
    >
      {/* Hover actions on the right side */}
      <List.Content floated='right'>
        {isHovered && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button icon size='mini' color='blue' onClick={handleEditClick} aria-label='Edit'>
              <Icon name='edit' />
            </Button>
            <ConfirmButton buttonName='❌' onClick={handleDeleteClick} />
          </div>
        )}
      </List.Content>

      {/* Clicking on the text should select the item */}
      <List.Content onClick={onSelect} style={{ cursor: 'pointer' }}>
        <List.Header as='a' style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          {text}
        </List.Header>
      </List.Content>
    </List.Item>
  );
};

export default EditableListItem;
