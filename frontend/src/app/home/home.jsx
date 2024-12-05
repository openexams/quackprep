import { useDispatch } from 'react-redux';
import { Container, Header, Button, Icon, Grid, Segment, Card, Image } from 'semantic-ui-react';
import duckBlissImage from '/img/home/duck_bliss.webp';
import libraryComputerDucks from '/img/home/library_computer_ducks.webp';
import extensiveDucks from '/img/home/extensive_ducks.webp';
import kiteDuck from '/img/home/duck_kite.webp';
import { useNavigate } from 'react-router-dom';

import { changeNavbarPage } from '@components/navbar/navbarSlice';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const features = [
    {
      icon: extensiveDucks,
      title: 'Extensive Question Bank',
      description: 'Access a wide range of questions across multiple subjects.',
    },
    {
      icon: kiteDuck,
      title: 'AI Generated Questions',
      description: 'Leverage AI to explore all exam questions and receive personalized, AI-generated questions.',
    },
    {
      icon: libraryComputerDucks,
      title: 'Track Your Progress',
      description: 'Monitor your learning journey and identify areas for improvement.',
    },
  ];

  const testimonials = [
    {
      text: 'This platform significantly improved my exam preparation. The practice questions were highly effective.',
      author: '- ChatGPT',
    },
    {
      text: 'Even my pet rock aced the test! Highly recommended for humans and rocks alike!',
      author: '- Claude AI',
    },
  ];

  return (
    <div className='home-page'>
      <Segment inverted vertical textAlign='center' style={{ minHeight: 700, padding: '1em 0em', position: 'relative' }}>
        <img
          loading='lazy'
          src={duckBlissImage}
          style={{
            position: 'absolute',
            top: 6,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
        <Container
          style={{
            zIndex: 1,
            position: 'relative', // Ensure it stays above the background
            textAlign: 'center', // Center the text inside the container
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%', // Stretch container height to match the segment
          }}
          text
          textAlign='center'
        >
          <Header
            as='h1'
            inverted
            style={{
              fontSize: '4em',
              fontWeight: 'bold',
              marginBottom: '0.5em',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            Master Your Exams
          </Header>
          <Header
            as='h2'
            style={{
              fontSize: '1.7em',
              fontWeight: 'normal',
              marginTop: '.3em',
              marginBottom: '1em',
              color: 'white',
              textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 8px rgba(0,0,0,0.5)',
            }}
          >
            Unlock your potential with our adaptive learning platform. Personalized practice, expert explanations, and real-time
            feedback.
          </Header>
          <Button
            primary
            size='huge'
            onClick={() => dispatch(changeNavbarPage(navigate, '/class'))}
            style={{
              backgroundColor: '#fbbd08',
              color: 'rgba(0, 0, 0, 0.8)',
            }}
          >
            Start Practicing
            <Icon name='right arrow' style={{ marginLeft: '0.5em' }} />
          </Button>
        </Container>
      </Segment>

      <Segment style={{ padding: '8em 0em' }} vertical>
        <Container text>
          <Header as='h3' style={{ fontSize: '2em', textAlign: 'center' }}>
            Key Features
          </Header>
          <Grid stackable columns={3} style={{ marginTop: '3em' }}>
            {features.map((feature, index) => (
              <Grid.Column key={index}>
                <Card fluid>
                  <img style={{ height: '15.35rem', width: '15.35rem' }} loading='lazy' src={feature.icon} />
                  <Card.Content>
                    <Card.Header>{feature.title}</Card.Header>
                    <Card.Description>{feature.description}</Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))}
          </Grid>
        </Container>
      </Segment>

      <Segment style={{ padding: '8em 0em' }} vertical>
        <Container text>
          <Header as='h3' style={{ fontSize: '2em', textAlign: 'center' }}>
            What Our Users Say
          </Header>
          <Grid stackable columns={2} style={{ marginTop: '3em' }}>
            {testimonials.map((testimonial, index) => (
              <Grid.Column key={index}>
                <Segment raised>
                  <p style={{ fontSize: '1.33em' }}>"{testimonial.text}"</p>
                  <Header as='h4'>{testimonial.author}</Header>
                </Segment>
              </Grid.Column>
            ))}
          </Grid>
        </Container>
      </Segment>
    </div>
  );
}
