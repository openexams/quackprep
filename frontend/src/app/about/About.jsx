import { Container, Header, Grid } from 'semantic-ui-react';
import CreatorInfo from './CreatorInfo.jsx';

const About = () => {
  const creators = [
    {
      imgSrc:
        'https://media.licdn.com/dms/image/v2/D5603AQFo1LTbAVeJ-A/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1707747042254?e=1743033600&v=beta&t=sEuGzlRHda7qrMS_ROE_EYWo09FRDSHtzlOL_VGL_r4',
      name: 'Maddox Schmidlkofer',
      description: 'All work and no play makes maddox a dull boy.', //Founder and Lead Developer of QuackPrep. Passionate about creating innovative solutions to make learning fun and engaging for college students.
      links: [
        { label: 'GitHub', url: 'https://github.com/maddox05', icon: 'github', color: 'black' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/maddox-schmidlkofer/', icon: 'linkedin', color: 'blue' },
      ],
    },
    {
      imgSrc:
        'https://media.licdn.com/dms/image/v2/D5603AQH9l-dAsT1WXQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1699241824248?e=1743033600&v=beta&t=T7FaGrM_q1ogj_G6X7_BKCTkj5WDnswVCXIJrtqlb2U',
      name: 'Hayes Bounds',
      description: 'Think about that', //Founder and Lead Developer of QuackPrep. Passionate about creating innovative solutions to make learning fun and engaging for college students.
      links: [
        { label: 'GitHub', url: 'https://github.com/hebounds', icon: 'github', color: 'black' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/hayes-bounds-441a7b210/', icon: 'linkedin', color: 'blue' },
      ],
    },
  ];

  return (
    <Container style={{ marginTop: '2em', marginBottom: '2em' }}>
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

      <Grid stackable columns={3}>
        {creators.map((creator, index) => (
          <Grid.Column key={index}>
            <CreatorInfo imgSrc={creator.imgSrc} name={creator.name} description={creator.description} links={creator.links} />
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  );
};

export default About;
