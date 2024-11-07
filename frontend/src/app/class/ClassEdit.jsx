import React, { useState } from 'react';
import { Card, Icon, Button, Modal } from 'semantic-ui-react';
import CreateInputForm from '@components/CreateInputForm';
import ConfirmButton from '@components/ConfirmButton';
import { upsertClass, deleteClassById } from './classSlice';
import { useDispatch } from 'react-redux';
import PlusIconCard from '@components/PlusIconCard';
export default function ClassEdit({ id, name = '', description = '', category = '', school_id = '' }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleSubmit = ({ name, description, category, school_id }) => {
    dispatch(upsertClass(id, school_id, name, description, category));
    setIsEditing(false);
  };

  function handleDelete() {
    if (id) {
      dispatch(deleteClassById(id));
    } else {
      console.log('Cant delete a class thats not even created!');
    }
    setIsEditing(false);
  }

  const formFields = [
    { name: 'name', value: name, required: true },
    { name: 'description', value: description, required: true },
    { name: 'category', value: category, required: true },
    { name: 'school_id', value: school_id, required: true },
  ];

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
            <Card.Description>{description}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Icon name='folder' />
            {category}
            <span style={{ float: 'right' }}>
              <Icon name='building' />
              ID: {school_id}
            </span>
          </Card.Content>
        </Card>
      ) : (
        <PlusIconCard Title={'Add a Class'} onClick={() => setIsEditing(true)} />
      )}

      <Modal closeIcon open={isEditing} onClose={() => setIsEditing(false)} size='small'>
        <Modal.Header>Edit Class</Modal.Header>
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
