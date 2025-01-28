import { useDispatch } from 'react-redux';
import { Segment, Card, Icon, Container, Header, Grid } from 'semantic-ui-react';
import { changeNavbarPage } from '@app/layout/navbar/navbarSlice';
import { useNavigate } from 'react-router-dom';

export default function Explainer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* Explainer Section */
  return (
    <Segment style={{ padding: '6em 1em', backgroundColor: '#f9f9f9' }} vertical>
      <Container>
        <Header as='h3' style={{ fontSize: '2em', textAlign: 'center' }}>
          How to Use QuackPrep.com
        </Header>
        <Grid stackable columns={1} style={{ marginTop: '2em' }}>
          <Grid.Column>
            <Header as='h6' style={{ fontSize: '1.2em', textAlign: 'center', color: '#333' }}>
              Follow These Simple Steps to Get Started:
            </Header>
            <Card.Group itemsPerRow={3} stackable centered style={{ marginTop: '2em' }}>
              {/* Step 1 */}
              <Card raised onClick={() => dispatch(changeNavbarPage(navigate, '/auth'))}>
                <Card.Content textAlign='center'>
                  <Icon name='user plus' size='huge' color='teal' style={{ marginBottom: '0.5em' }} />
                  <Card.Header as='h4' style={{ fontSize: '1.33em', color: '#333' }}>
                    Sign Up/Log In
                  </Card.Header>
                  <Card.Description style={{ fontSize: '1.1em', color: '#666' }}>
                    Create an account or log in to your existing QuackPrep account to get started.
                  </Card.Description>
                </Card.Content>
              </Card>

              {/* Step 4 */}
              <Card raised onClick={() => dispatch(changeNavbarPage(navigate, '/create'))}>
                <Card.Content textAlign='center'>
                  <Icon name='magic' size='huge' color='purple' style={{ marginBottom: '0.5em' }} />
                  <Card.Header as='h4' style={{ fontSize: '1.33em', color: '#333' }}>
                    Generate AI-Powered Content
                  </Card.Header>
                  <Card.Description style={{ fontSize: '1.1em', color: '#666' }}>
                    Use the AI-generated Content feature to get personalized study material.
                  </Card.Description>
                </Card.Content>
              </Card>

              <Card raised onClick={() => dispatch(changeNavbarPage(navigate, '/class'))}>
                <Card.Content textAlign='center'>
                  <Icon name='search' size='huge' color='orange' style={{ marginBottom: '0.5em' }} />
                  <Card.Header as='h4' style={{ fontSize: '1.33em', color: '#333' }}>
                    Explore the Question Bank
                  </Card.Header>
                  <Card.Description style={{ fontSize: '1.1em', color: '#666' }}>
                    Browse through the AI Content or Create your own questions.
                  </Card.Description>
                </Card.Content>
              </Card>

              {/* Step 5 */}
              <Card raised onClick={() => dispatch(changeNavbarPage(navigate, '/stats'))}>
                <Card.Content textAlign='center'>
                  <Icon name='chart line' size='huge' color='green' style={{ marginBottom: '0.5em' }} />
                  <Card.Header as='h4' style={{ fontSize: '1.33em', color: '#333' }}>
                    Track Your Progress
                  </Card.Header>
                  <Card.Description style={{ fontSize: '1.1em', color: '#666' }}>
                    Monitor your performance and identify areas where you need improvement.
                  </Card.Description>
                </Card.Content>
              </Card>

              {/* Step 6 */}
              <Card raised onClick={() => dispatch(changeNavbarPage(navigate, '/learn'))}>
                <Card.Content textAlign='center'>
                  <Icon name='redo' size='huge' color='red' style={{ marginBottom: '0.5em' }} />
                  <Card.Header as='h4' style={{ fontSize: '1.33em', color: '#333' }}>
                    Review and Improve
                  </Card.Header>
                  <Card.Description style={{ fontSize: '1.1em', color: '#666' }}>
                    Review your answers, understand your mistakes, and continue practicing to improve your scores.
                  </Card.Description>
                </Card.Content>
              </Card>
            </Card.Group>
          </Grid.Column>
        </Grid>
      </Container>
    </Segment>
  );
}
