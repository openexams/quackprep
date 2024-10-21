import { useDispatch, useSelector } from 'react-redux';
import { Card, Image, Icon, Button } from 'semantic-ui-react';
import { selectUser } from '../auth/authSlice';
import { changeNavbarPage } from '@components/navbar/navbarSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '7rem',
      }}
    >
      <Card
        centered
        style={{
          width: '350px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Image
          src={user.icon || `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
          ui={false}
          style={{
            maxHeight: '250px',
            objectFit: 'cover/',
          }}
        />
        <Card.Content textAlign='center'>
          <Card.Header style={{ fontSize: '1.6rem', fontWeight: '600' }}>
            {user.firstName} {user.lastName}
          </Card.Header>
          <Card.Meta>
            <span className='username' style={{ color: '#888', fontSize: '1.1rem' }}>
              @{user.username}
            </span>
          </Card.Meta>
          <Card.Description
            style={{
              marginTop: '8px',
              fontSize: '1rem',
              color: '#555',
            }}
          >
            {user.email}
          </Card.Description>
        </Card.Content>
        <Card.Content extra textAlign='center'>
          <Icon name='user' />
          <span style={{ fontSize: '1.1rem' }}>User ID: {user.id}</span>
        </Card.Content>
        <Card.Content extra textAlign='center'>
          <Button
            primary
            fluid
            style={{
              backgroundColor: '#2185d0',
              color: '#fff',
              fontWeight: '500',
            }}
            onClick={() => dispatch(changeNavbarPage('/account'))}
          >
            Edit Profile
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
}
