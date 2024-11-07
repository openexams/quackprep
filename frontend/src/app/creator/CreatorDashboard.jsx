import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Header, Icon, Segment, Button, Card, List, Image, Feed } from 'semantic-ui-react';
import { getUserCount, selectUserCount } from '../home/homeSlice';
import { changeNavbarPage } from '@components/navbar/navbarSlice';

export default function CreatorDashboard() {
  const dispatch = useDispatch();
  const userCount = useSelector(selectUserCount).userCount;

  useEffect(() => {
    if (!userCount) dispatch(getUserCount());
  }, []);
  return (
    // ADD STATS AS WELL TODO
    <Container style={{ padding: '3rem 0' }}>
      {/* Hero Section */}
      <Segment basic textAlign='center' style={{ marginBottom: '3rem' }}>
        <Icon name='graduation cap' color='blue' style={{ textAlign: 'center', marginBottom: '-8rem' }} size='huge' />
        <Header as='h1' size='huge' textAlign='center'>
          Become an QuackPrep Creator (COMING SOON!)
          <Header.Subheader style={{ marginTop: '1rem' }}>
            Share your knowledge and help students ace their exams
          </Header.Subheader>
        </Header>
        <Button
          primary
          size='huge'
          style={{ marginTop: '2rem' }}
          onClick={() => {
            dispatch(changeNavbarPage('/create'));
          }}
        >
          <Icon name='plus' />
          Start Creating
        </Button>
      </Segment>

      {/* Benefits Section */}
      <Grid columns={1} stackable divided style={{ marginBottom: '3rem' }}>
        <Grid.Column textAlign='center'>
          <Icon name='users' size='huge' color='blue' />
          <Header as='h3'>
            Reach Students
            <Header.Subheader>Connect with students looking for quality exam prep</Header.Subheader>
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
                <Icon name='clipboard check' size='big' color='blue' />
                <Card.Header style={{ marginTop: '1rem' }}>1. Sign Up</Card.Header>
                <Card.Description>Create your creator account in minutes</Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid>
              <Card.Content textAlign='center'>
                <Icon name='pencil' size='big' color='blue' />
                <Card.Header style={{ marginTop: '1rem' }}>2. Create Content</Card.Header>
                <Card.Description>Upload your exam prep materials</Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid>
              <Card.Content textAlign='center'>
                <Icon name='check circle' size='big' color='blue' />
                <Card.Header style={{ marginTop: '1rem' }}>3. Get Approved</Card.Header>
                <Card.Description>Quick review process for quality</Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid>
              <Card.Content textAlign='center'>
                <Icon name='rocket' size='big' color='blue' />
                <Card.Header style={{ marginTop: '1rem' }}>4. Launch</Card.Header>
                <Card.Description>Your content goes live to students</Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </Segment>

      {/* Call to Action */}
      <Segment
        padded='very'
        textAlign='center'
        style={{
          background: 'linear-gradient(to right, #2185d0, #21ba45)',
          color: 'white',
          borderRadius: '1rem',
        }}
      >
        <Header as='h2' inverted>
          Ready to Start?
          <Header.Subheader style={{ color: 'white', marginTop: '1rem' }}>
            Join our community of QuackPrep creators today
          </Header.Subheader>
        </Header>
        <Button
          size='huge'
          inverted
          style={{ marginTop: '2rem' }}
          onClick={() => {
            dispatch(changeNavbarPage('/create'));
          }}
        >
          Begin Your Journey
        </Button>
      </Segment>

      {/* Quick Stats */}
      <Grid columns={3} divided stackable style={{ marginTop: '3rem' }}>
        <Grid.Column textAlign='center'>
          <Header as='h2' color='blue'>
            {userCount}
            <Header.Subheader>Active Students</Header.Subheader>
          </Header>
        </Grid.Column>
        <Grid.Column textAlign='center'>
          <Header as='h2' color='blue'>
            At Least 1<Header.Subheader>Expert Creators</Header.Subheader>
          </Header>
        </Grid.Column>
        <Grid.Column textAlign='center'>
          <Header as='h2' color='blue'>
            1 Billion%
            <Header.Subheader>Student Satisfaction</Header.Subheader>
          </Header>
        </Grid.Column>
      </Grid>
    </Container>
  );
}
