import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { Container, Grid, Header, List, Segment, Icon } from 'semantic-ui-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerStyle = {
    flexShrink: 0,
    backgroundColor: '#1b1c1d',
    color: 'rgba(255,255,255,.9)',
    padding: '3em 0em',
    marginTop: '3em',
  };

  return (
    <BrowserRouter>
      <Segment inverted vertical style={footerStyle}>
        <Container>
          <Grid divided inverted stackable>
            <Grid.Row>
              <Grid.Column width={3}>
                <Header inverted as='h4' content='About' />
                <List link inverted>
                  <List.Item as={Link} to='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                    Company
                  </List.Item>
                  <List.Item as={Link} to='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                    Contact Us
                  </List.Item>
                  <List.Item as={Link} to='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                    Careers
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as='h4' content='Services' />
                <List link inverted>
                  <List.Item as={Link} to='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                    Web Design
                  </List.Item>
                  <List.Item as={Link} to='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                    Development
                  </List.Item>
                  <List.Item as={Link} to='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                    Hosting
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <Header as='h4' inverted>
                  Stay Connected
                </Header>
                <p>Follow us on social media for updates and news.</p>
                <List horizontal inverted divided link size='small'>
                  <List.Item as='a' href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                    <Icon name='twitter' /> Twitter
                  </List.Item>
                  <List.Item as='a' href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                    <Icon name='facebook' /> Facebook
                  </List.Item>
                  <List.Item as='a' href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                    <Icon name='linkedin' /> LinkedIn
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Segment inverted textAlign='center' style={{ margin: '2em 0em 0em', padding: '0em' }}>
            <Container textAlign='center'>
              <List horizontal inverted divided link size='small'>
                <List.Item as={Link} to='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                  Terms of Service
                </List.Item>
                <List.Item as={Link} to='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                  Privacy Policy
                </List.Item>
                <List.Item as='a' href='mailto:quackprep@gmail.com'>
                  quackprep@gmail.com
                </List.Item>
              </List>
              <p style={{ marginTop: '1em' }}>© {currentYear} MaddoxWorks LLC. All rights reserved.</p>
            </Container>
          </Segment>
        </Container>
      </Segment>
    </BrowserRouter>
  );
}
