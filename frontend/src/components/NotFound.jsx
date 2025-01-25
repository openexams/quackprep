import React from 'react';
import { Container, Header, Icon, Segment, Button, Image } from 'semantic-ui-react';
import quack from '/img/quackprep_logo.webp';
import { changeNavbarPage } from '../app/layout/navbar/navbarSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleHomepageClick = () => {
    dispatch(changeNavbarPage(navigate, '/'));
  };

  return (
    <Container text>
      <Segment
        placeholder
        padded='very'
        textAlign='center'
        style={{ animation: 'shake 0.5s', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
      >
        <Header icon>
          <Image
            size='massive'
            as={'img'}
            src={quack}
            style={{ filter: 'drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.5))' }}
            alt='QuackPrep Logo'
          />
          <div style={{ fontSize: '2.5em', marginTop: '0.5em', marginBottom: '.3em', color: '#2D89FF' }}>
            404 - Page Not Found
          </div>
        </Header>
        <Segment.Inline>
          <p style={{ fontSize: '1.2em', color: '#333', marginBottom: '1.5em' }}>
            We're sorry, but the page you're looking for doesn't exist.
          </p>
          <p style={{ fontSize: '1em', color: '#555' }}>You may have mistyped the address or the page may have moved.</p>
        </Segment.Inline>
        <Button
          primary
          onClick={handleHomepageClick}
          style={{
            marginTop: '2em',
            padding: '1em 2em',
            fontSize: '1.1em',
            borderRadius: '12px',
            backgroundColor: '#FFA500',
            color: '#fff',
          }}
          animated='fade'
        >
          <Button.Content visible>Go to Homepage</Button.Content>
          <Button.Content hidden>Take Me Back!</Button.Content>
        </Button>
      </Segment>
    </Container>
  );
};

export default NotFoundPage;
