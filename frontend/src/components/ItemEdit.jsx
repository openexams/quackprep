import React, { useState } from 'react';
import { Card, Button, Modal } from 'semantic-ui-react';
import CreateInputForm from '@components/CreateInputForm';
import ConfirmButton from '@components/ConfirmButton';
import PlusIconCard from '@components/PlusIconCard';

/**
 * Creates a card that can be edited and deleted or if no name is present it will show a card with a plus icon
 * @param {*} props
 * @param {Int} props.id
 * @param {String} props.name
 * @param {String} props.desc
 * @param {import('./CreateInputForm').FormField[]} props.formFields
 * @param {Function} props.onSubmit
 * @param {Function} props.onDelete
 *
 * @returns {JSX.Element}
 */
export default function ItemEdit({ id, name, desc, formFields, onSubmit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleSubmit = (fields) => {
    onSubmit(fields);
    setIsEditing(false);
  };

  function handleDelete() {
    if (id) {
      onDelete(id);
    } else {
      console.log('Cant delete a item thats not even created!');
    }
    setIsEditing(false);
  }

  return (
    <>
      {name !== '' ? (
        <Card
          style={{
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            cursor: 'pointer',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setIsEditing(true)}
        >
          <Card.Content>
            <Card.Header>{`id:${id || 'na'} ${name}`}</Card.Header>
            <Card.Description>{desc}</Card.Description>
          </Card.Content>
        </Card>
      ) : (
        <PlusIconCard Title={'Add a Item'} onClick={() => setIsEditing(true)} />
      )}

      <Modal closeIcon open={isEditing} onClose={() => setIsEditing(false)} size='small'>
        <Modal.Header>Edit Item</Modal.Header>
        <Modal.Content>
          <CreateInputForm formFields={formFields} onSubmit={handleSubmit} buttonText='Save Changes' />
          {id && <ConfirmButton confirmText='Are u sure u wanan delete' buttonName='delete' onClick={handleDelete} />}
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
