import { useDispatch } from 'react-redux';
import { Container, Header, Button, Icon, Segment } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { changeNavbarPage } from '@app/layout/navbar/navbarSlice';
import duckBlissImage from '/img/home/duck_bliss.webp';

import './home.css';
import Explainer from './Explainer';
import HomeGraph from './Graph';
import Testimonials from './Testimonials';
import KeyFeatures from './KeyFeatures';

// Register Chart.js components

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      <KeyFeatures />

      <HomeGraph />
      <Explainer />
      <Testimonials />
    </div>
  );
}
