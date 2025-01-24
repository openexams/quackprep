import { useDispatch } from 'react-redux';
import { Container, Header, Button, Icon, Grid, Segment, Card } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

import { changeNavbarPage } from '@src/app/layout/navbarSlice';

import duckBlissImage from '/img/home/duck_bliss.webp';
import libraryComputerDucks from '/img/home/library_computer_ducks.webp';
import extensiveDucks from '/img/home/extensive_ducks.webp';
import kiteDuck from '/img/home/duck_kite.webp';
import './home.css';

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
    <div className='home-page' style={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Segment
        inverted
        vertical
        textAlign='center'
        style={{
          marginTop: 0,
          minHeight: 700,
          padding: '1em 0em',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img
          loading='lazy'
          src={duckBlissImage}
          width='1792'
          height='1024'
          alt='quackprep background image'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'brightness(0.85)',
          }}
        />
        <Container
          style={{
            zIndex: 1,
            position: 'relative',
            textAlign: 'center',
          }}
          text
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
            The First Study Tool that "Grows with You" as you Learn
          </Header>
          <Button
            className='get-started-button pulsing'
            primary
            size='huge'
            onClick={() => dispatch(changeNavbarPage(navigate, '/class'))}
            style={{
              backgroundColor: '#fbbd08',
              color: 'rgba(0, 0, 0, 0.8)',
            }}
          >
            Get Started
            <Icon name='right arrow' style={{ marginLeft: '0.5em' }} />
          </Button>
        </Container>
      </Segment>

      {/* Key Features Section */}
      <Segment style={{ padding: '8em 1em', backgroundColor: '#f9f9f9' }} vertical>
        <Container text>
          <Header as='h3' style={{ fontSize: '2em', textAlign: 'center' }}>
            Key Features
          </Header>
          <Grid stackable columns={3} style={{ marginTop: '3em' }} divided='vertically'>
            {features.map((feature, index) => (
              <Grid.Column key={index}>
                <Card fluid raised>
                  <img
                    alt='quackprep informative'
                    height={215}
                    width={215}
                    loading='lazy'
                    src={feature.icon}
                    style={{
                      width: '100%',
                      maxHeight: '215px',
                      objectFit: 'cover',
                    }}
                  />
                  <Card.Content textAlign='center'>
                    <Card.Header>{feature.title}</Card.Header>
                    <Card.Description>{feature.description}</Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))}
          </Grid>
        </Container>
      </Segment>

      {/* Testimonials Section */}
      <Segment style={{ padding: '8em 1em', backgroundColor: '#ffffff' }} vertical>
        <Container text>
          <Header as='h3' style={{ fontSize: '2em', textAlign: 'center' }}>
            What Our Users Say
          </Header>
          <Grid stackable columns={2} style={{ marginTop: '3em' }} relaxed='very'>
            {testimonials.map((testimonial, index) => (
              <Grid.Column key={index}>
                <Segment raised>
                  <p style={{ fontSize: '1.33em', fontStyle: 'italic' }}>"{testimonial.text}"</p>
                  <Header as='h4' textAlign='right'>
                    {testimonial.author}
                  </Header>
                </Segment>
              </Grid.Column>
            ))}
          </Grid>
        </Container>
      </Segment>
    </div>
  );
}
