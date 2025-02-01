import { Segment, Header, Container, Grid, Card } from 'semantic-ui-react';
import libraryComputerDucks from '/img/home/library_computer_ducks.webp';
import extensiveDucks from '/img/home/extensive_ducks.webp';
import kiteDuck from '/img/home/duck_kite.webp';
export default function KeyFeatures() {
  const features = [
    {
      icon: extensiveDucks,
      title: 'Extensive Exam Bank',
      description: 'Access a wide range of Exams across multiple schools and classes.',
    },
    {
      icon: kiteDuck,
      title: 'AI Generated Questions',
      description: 'Leverage AI to generate personalized questions tailored to your strengths and weaknesses.',
    },
    {
      icon: libraryComputerDucks,
      title: 'Track Your Progress',
      description: 'Monitor your learning journey and identify areas for improvement.',
    },
  ];
  return (
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
  );
}
