import { useDispatch } from 'react-redux';
import { Container, Header, Button, Icon, Segment, Grid } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { changeNavbarPage } from '@app/layout/navbar/navbarSlice';
import './home.css';
import Explainer from './Explainer';
import HomeGraph from './Graph';
import Testimonials from './Testimonials';
import KeyFeatures from './KeyFeatures';
import desktop from '/img/home/desktop.png';
import mobile from '/img/home/mobile.png';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className='home-page' style={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Segment
        basic
        vertical
        textAlign='left'
        style={{
          marginTop: 0,
          minHeight: '90vh',
          padding: '5em 0',
          position: 'relative',
          backgroundColor: 'white',
        }}
      >
        <Container>
          <Grid stackable verticalAlign='middle'>
            <Grid.Row>
              <Grid.Column width={7} style={{ paddingRight: '4em', paddingLeft: '3em' }}>
                <Header
                  as='h1'
                  style={{
                    fontSize: '3.5rem',
                    fontWeight: 800,
                    lineHeight: 1.2,
                    marginBottom: '1.5rem',
                    color: '#2d3436',
                  }}
                >
                  The{' '}
                  <a rel='noopener noreferrer' target='_blank' href='https://github.com/openexams/quackprep'>
                    <i>Open Source</i>
                  </a>{' '}
                  Exam Studying Platform
                </Header>
                <div>
                  <p
                    style={{
                      fontSize: '1.25rem',

                      color: '#636e72',
                      lineHeight: 1.6,
                    }}
                  >
                    Easily find free past exams & study material filtered by your college.
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <a href='https://discord.com/invite/APy5379qT8'>
                      <span style={{ fontSize: '0.875rem', color: '#636e72' }}>Join the community today</span>
                      <img
                        src='/icon/discord_icon.svg'
                        alt='Discord'
                        style={{
                          width: '20px',
                          height: '20px',
                          verticalAlign: 'middle', // Adjust this value as needed
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </a>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Button
                    primary
                    size='huge'
                    onClick={() => dispatch(changeNavbarPage(navigate, '/class'))}
                    style={{
                      backgroundColor: '#4a90e2',
                      color: 'white',
                      padding: '1.2em 2em',
                      borderRadius: '12px',
                      transition: 'transform 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}
                  >
                    Get Started
                    <Icon name='right arrow' style={{ marginLeft: '0.5em' }} />
                  </Button>
                </div>
              </Grid.Column>

              <Grid.Column width={9} style={{ paddingRight: '4em' }}>
                <div
                  style={{
                    position: 'relative',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    borderRadius: '24px',
                    boxShadow: '0 30px 70px -15px rgba(0, 0, 100, 0.5)',
                  }}
                >
                  <img
                    src={desktop}
                    alt='Desktop app preview'
                    style={{
                      borderRadius: '24px',
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-50px',
                      right: '-30px',
                      width: '40%',
                      borderRadius: '20px',
                      boxShadow: '0 25px 50px -10px rgba(0, 0, 100, 0.3)',
                      transform: 'rotate(5deg)',
                    }}
                  >
                    <img
                      src={mobile}
                      alt='Mobile app preview'
                      style={{
                        borderRadius: '20px',
                        width: '100%',
                        height: 'auto',
                      }}
                    />
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>

      <KeyFeatures />
      <HomeGraph />
      <Explainer />
      <Testimonials />
    </div>
  );
}
