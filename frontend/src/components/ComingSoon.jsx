import { useNavigate } from 'react-router-dom';
import { Container, Segment, Header, Icon, Button, Grid } from 'semantic-ui-react';

export default function ComingSoon() {
  const navigate = useNavigate();
  return (
    <Container style={{ marginTop: '3rem', marginBottom: '3rem' }}>
      <Grid textAlign='center' verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 600 }}>
          <Segment raised style={{ padding: '3rem' }}>
            <Icon name='rocket' size='huge' style={{ marginBottom: '1rem' }} />
            <Header as='h1' style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              Something Amazing is Coming Soon!
            </Header>
            <p style={{ fontSize: '1.2rem', color: '#555' }}>
              We're working hard to bring you an exciting new experience. Stay tuned for updates and be among the first to know
              when we launch!
            </p>

            <Button
              size='large'
              style={{ marginTop: '2rem' }}
              onClick={() => {
                navigate('/');
              }}
            >
              Home
            </Button>
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
}
