import { useDispatch } from 'react-redux';
import { Container, Header, Button, Icon, Grid, Segment, Card } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { changeNavbarPage } from '@app/layout/navbar/navbarSlice';
import duckBlissImage from '/img/home/duck_bliss.webp';
import libraryComputerDucks from '/img/home/library_computer_ducks.webp';
import extensiveDucks from '/img/home/extensive_ducks.webp';
import kiteDuck from '/img/home/duck_kite.webp';
import './home.css';

// Import Chart.js components
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Explainer from './Explainer';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  // Sample data for the bar chart
  const chartData = {
    labels: ['College Math', 'Computer Science', 'Physics', 'Chemistry', 'Biology'],
    datasets: [
      {
        label: 'QuackprepAI Benchmark Score (%)',
        data: [83.3, 89, 92.8, 64.7, 69.2],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'gpt4o Benchmark Score (%)',
        data: [13.4, 11, 59.5, 40.2, 61.6],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false, // Add this line

    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'QuackPrepAI* vs gpt4o (MMLU) in STEM Categories',
      },
    },
  };

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

      <Segment style={{ padding: '8em 1em' }} vertical>
        <Container>
          <Header as='h3' style={{ fontSize: '2em', textAlign: 'center' }}>
            How Accurate is QuackPrep?
          </Header>
          <Grid stackable columns={2} verticalAlign='middle' style={{ marginTop: '3em' }}>
            {/* Description on the Left */}
            <Grid.Column>
              <Header as='h4' style={{ fontSize: '1.5em' }}>
                QuackPrep's AI Accuracy in STEM Categories
              </Header>
              <p style={{ fontSize: '1.2em' }}>
                Our AI-powered tool leverages advanced algorithms to provide accurate and reliable assistance across various STEM
                subjects. Compare the performance of Quackprep AI against the standard model to see how we stand out in enhancing
                your learning experience.
              </p>
            </Grid.Column>

            {/* Bar Chart on the Right */}
            <Grid.Column>
              <div className='chart-container'>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>

      <Explainer />

      {/* Testimonials Section */}
      <Segment style={{ padding: '8em 1em' }} vertical>
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
