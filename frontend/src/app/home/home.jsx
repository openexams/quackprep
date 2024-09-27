import { useDispatch } from 'react-redux';
import { Container, Header, Button, Icon, Grid, Segment, Card, Image } from 'semantic-ui-react';
import horse from '/img/horse.webp';
import { changeNavbarPage } from '@components/navbar/navbarSlice';

export default function Home() {
  const dispatch = useDispatch();

  const features = [
    {
      icon: horse,
      title: 'Extensive Question Bank',
      description: 'Access a wide range of questions across multiple subjects.',
    },
    {
      icon: horse,
      title: 'Video Tutorials',
      description: 'Learn from expert explanations and step-by-step video guides.',
    },
    {
      icon: horse,
      title: 'Track Your Progress',
      description: 'Monitor your learning journey and identify areas for improvement.',
    },
  ];

  const testimonials = [
    {
      text: 'This platform has transformed the way I prepare for exams. The practice questions are top-notch!',
      author: 'Sarah J.',
    },
    { text: 'The video tutorials helped me understand complex topics with ease. Highly recommended!', author: 'Michael L.' },
  ];

  return (
    <div className='home-page'>
      <Segment
        inverted
        vertical
        textAlign='center'
        style={{ minHeight: 700, padding: '1em 0em', backgroundImage: `url(${horse})`, backgroundSize: 'cover' }}
      >
        <Container text style={{ marginTop: '7em' }}>
          <Header as='h1' inverted style={{ fontSize: '4em', fontWeight: 'normal', marginBottom: 0 }}>
            Master Your Exams
          </Header>
          <Header
            as='h2'
            inverted
            style={{
              fontSize: '1.7em',
              fontWeight: 'normal',
              marginTop: '1.5em',
            }}
          >
            Practice questions, detailed explanations, and personalized learning just for you.
          </Header>
          <Button primary size='huge' onClick={() => dispatch(changeNavbarPage('/class'))}>
            Start Practicing
            <Icon name='right arrow' />
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
                  <Image src={feature.icon} wrapped ui={false} />
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

      <Segment inverted vertical style={{ padding: '5em 0em' }}>
        <Container>
          <Grid divided inverted stackable>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header inverted as='h4' content='About Us' />
                <p>We are dedicated to helping students achieve their academic goals through innovative learning solutions.</p>
              </Grid.Column>
              <Grid.Column width={8}>
                <Header inverted as='h4' content='Connect With Us' />
                <Button
                  as={'a'}
                  circular
                  color='facebook'
                  icon='facebook'
                  href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                  target='_blank'
                />
                <Button
                  as={'a'}
                  circular
                  color='twitter'
                  icon='twitter'
                  href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                  target='_blank'
                />
                <Button
                  as={'a'}
                  circular
                  color='linkedin'
                  icon='linkedin'
                  href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                  target='_blank'
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
    </div>
  );
}
