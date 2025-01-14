import { useState } from 'react';
import { List, Icon } from 'semantic-ui-react';

const EditableListItem = ({ text, onEdit, onDelete, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleEditClick = (e) => {
    // Prevent the List.Item onClick or onSelect from firing
    e.stopPropagation();
    onEdit?.();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <List.Item onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Hover actions on the right side */}
      <List.Content floated='right'>
        {isHovered && (
          <>
            <Icon name='edit' link onClick={handleEditClick} style={{ marginRight: '0.5rem' }} />
            <Icon name='delete' link onClick={handleDeleteClick} />
          </>
        )}
      </List.Content>

      {/* Clicking on the text should select the item */}
      <List.Content onClick={onSelect}>
        <List.Header as='a'>{text}</List.Header>
      </List.Content>
    </List.Item>
  );
};

export default EditableListItem;
