import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Header, Icon, Segment, Button, Card } from 'semantic-ui-react';
import { getUserCount, selectUserCount } from '../home/homeSlice';
import { selectUser } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { makeUserACreator } from './creatorSlice';

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userCount = useSelector(selectUserCount).userCount;
  const user = useSelector(selectUser).user;

  useEffect(() => {
    if (!userCount) dispatch(getUserCount());
  }, []);

  return (
    <Container style={{ padding: '3rem 0' }}>
      {/* Hero Section */}
      <Segment basic textAlign='center' style={{ marginBottom: '3rem' }}>
        <Icon name='graduation cap' style={{ marginBottom: '-8rem' }} size='huge' />
        <Header as='h1' size='huge' textAlign='center'>
          Become a QuackPrep Creator!
          <Header.Subheader style={{ marginTop: '1rem' }}>
            Help students study smarter by sharing your knowledge.
          </Header.Subheader>
        </Header>
        <Button
          onClick={() => {
            if (!user?.is_creator) {
              dispatch(makeUserACreator());
            } else {
              window.alert('You are already a creator!');
            }
          }}
          primary
          size='huge'
          style={{ marginTop: '2rem' }}
        >
          <Icon name='lightbulb' />
          Get Started Now
        </Button>
      </Segment>

      <Grid columns={3} stackable divided style={{ marginBottom: '3rem' }}>
        <Grid.Column textAlign='center'>
          <Icon name='users' size='huge' />
          <Header as='h3'>
            Reach Thousands of Students
            <Header.Subheader>
              Make an impact by helping students succeed in their exams. By sharing your knowledge, you're not only empowering
              students but also solidifying your own understanding of the material.
            </Header.Subheader>
          </Header>
        </Grid.Column>
        <Grid.Column textAlign='center'>
          <Icon name='magic' size='huge' />
          <Header as='h3'>
            Experience AI Magic
            <Header.Subheader>
              QuackPrep's innovative AI transforms simple notes into interactive and engaging resources, making studying easier
              and more efficient for students.
            </Header.Subheader>
          </Header>
        </Grid.Column>
        <Grid.Column textAlign='center'>
          <Icon name='lightbulb' size='huge' />
          <Header as='h3'>
            Revolutionize Learning
            <Header.Subheader>
              With QuackPrep, you’re not just teaching—you’re contributing to a smarter, tech-driven way of learning. Join us to
              revolutionize how students prepare for exams!
            </Header.Subheader>
          </Header>
        </Grid.Column>
      </Grid>

      {/* How It Works */}
      <Segment basic style={{ marginBottom: '3rem' }}>
        <Header as='h2' textAlign='center' style={{ marginBottom: '2rem' }}>
          How It Works
        </Header>
        <Grid columns={4} stackable>
          <Grid.Column>
            <Card fluid>
              <Card.Content textAlign='center'>
                <Icon name='signup' size='big' />
                <Card.Header
                  style={{ marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                  onClick={() => navigate('/creatordashboard')}
                >
                  1. Join
                </Card.Header>
                <Card.Description>Sign up and become part of the QuackPrep creator community.</Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid>
              <Card.Content textAlign='center'>
                <Icon name='folder' size='big' />
                <Card.Header
                  style={{ marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                  onClick={() => navigate('/class')}
                >
                  2. Create a Class
                </Card.Header>
                <Card.Description>
                  Toggle edit mode then set up a class for your study material in just a few clicks.
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid>
              <Card.Content textAlign='center'>
                <Icon name='camera' size='big' />
                <Card.Header style={{ marginTop: '1rem' }}>3. Snap & Upload</Card.Header>
                <Card.Description>Take a picture of your study material and upload it to our platform.</Card.Description>{' '}
                {/* add a how too for this part */}
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid>
              <Card.Content textAlign='center'>
                <Icon name='plug' size='big' />
                <Card.Header style={{ marginTop: '1rem' }}>4. AI Magic</Card.Header>
                <Card.Description>Our AI processes your material, making it interactive and ready to study.</Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </Segment>

      {/* Quick Stats */}
      <Grid columns={3} divided stackable style={{ marginTop: '3rem' }}>
        <Grid.Column textAlign='center'>
          <Header as='h2'>
            {userCount}
            <Header.Subheader>Active Students</Header.Subheader>
          </Header>
        </Grid.Column>
        <Grid.Column textAlign='center'>
          <Header as='h2'>
            Growing Daily
            <Header.Subheader>Expert Creators</Header.Subheader>
          </Header>
        </Grid.Column>
        <Grid.Column textAlign='center'>
          <Header as='h2'>
            Unmatched
            <Header.Subheader>Student Satisfaction</Header.Subheader>
          </Header>
        </Grid.Column>
      </Grid>
    </Container>
  );
}
