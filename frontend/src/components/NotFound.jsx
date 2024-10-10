import React from 'react';
import { Container, Header, Icon, Segment, Button, Image } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import quack from '/img/quackprep_logo.webp';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container text>
      <Segment placeholder padded='very' textAlign='center'>
        <Header icon>
          {/* <Icon name='search' /> */}
          <Image size='massive' as={'img'} src={quack}></Image>
          <br></br> 404 - Page Not Found
        </Header>
        <Segment.Inline>
          <p>We're sorry, but the page you're looking for doesn't exist.</p>
          <p>You may have mistyped the address or the page may have moved.</p>
        </Segment.Inline>
        <Button primary onClick={() => navigate('/')} style={{ marginTop: '2em' }}>
          Go to Homepage
        </Button>
      </Segment>
    </Container>
  );
};

export default NotFoundPage;
