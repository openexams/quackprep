import { Container, Header, Grid, Image } from 'semantic-ui-react';
import CreatorInfo from './TeamCard.jsx';
import { contributors } from './contributors.js';

const About = () => {
  // add your stuff here if you contribute to the project

  return (
    <Container style={{ marginTop: '2em', marginBottom: '2em' }}>
      <Image src={'/img/quackprep_logo.webp'} centered size='small' style={{ marginBottom: '-5rem', zIndex: -1 }} />
      <Header as='h1' textAlign='center' style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
        About QuackPrep
      </Header>
      <p style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '2rem', color: '#555' }}>
        QuackPrep is your ultimate study companion, designed to help students excel in their exams and coursework. With an
        ever-growing library of AI-generated practice questions and tailored recommendations, QuackPrep ensures you always have
        the right material to focus on.
      </p>

      <Header as='h2' textAlign='center' style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Meet the Team
      </Header>

      <Grid stackable columns={3} padded>
        {contributors.map((contributor, index) => (
          <Grid.Column key={index}>
            <CreatorInfo
              imgSrc={contributor.imgSrc}
              name={contributor.name}
              description={contributor.description}
              links={contributor.links}
            />
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  );
};

export default About;
