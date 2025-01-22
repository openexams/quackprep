import { Link } from 'react-router-dom';
import { Container, Grid, Header, List, Segment, Icon, Image } from 'semantic-ui-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerStyle = {
    flexShrink: 0,
    backgroundColor: '#1b1c1d',
    color: 'rgba(255,255,255,.9)',
    padding: '3em 0em',
    marginTop: '3em',
    minHeight: '35vh',
  };

  return (
    <Segment inverted vertical style={footerStyle}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item as={Link} to='/about'>
                  Company
                </List.Item>
                <List.Item as='a' href='mailto:quackprep@gmail.com'>
                  Contact Us
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Feedback' />
              <List link inverted>
                <List.Item as='a' href='https://maddox.boo/Z5GAS' target='_blank' rel='noopener noreferrer'>
                  Feature Request
                </List.Item>
                <List.Item as='a' href='https://maddox.boo/Z5GAS' target='_blank' rel='noopener noreferrer'>
                  Bug Report
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                Stay Connected
              </Header>
              <p>Follow us on social media for updates and news.</p>
              <List horizontal inverted divided link size='small'>
                <List.Item
                  as='a'
                  href='https://www.youtube.com/playlist?list=PLDLOmQLH1ppwvW7tcnB1uiJrwUGPeUbzJ'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Icon color='red' name='youtube' /> Youtube
                </List.Item>
                <List.Item as='a' href='https://www.tiktok.com/@quackprep' target='_blank' rel='noopener noreferrer'>
                  <Image alt='tiktok logo' style={{ width: '17px' }} src='/img/tt_icon.webp' />
                  Tiktok
                </List.Item>
                <List.Item as='a' href='https://www.linkedin.com/company/quackprep' target='_blank' rel='noopener noreferrer'>
                  <Icon color='blue' name='linkedin' /> LinkedIn
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <div>
                A <strong style={{ fontSize: '1.5rem' }}>Maddox Schmidlkofer</strong> Production
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Segment inverted textAlign='center' style={{ margin: '2em 0em 0em', padding: '0em' }}>
          <Container textAlign='center'>
            <List horizontal inverted divided link size='small'>
              <List.Item as={Link} to='/tos' rel='noopener noreferrer'>
                Terms of Service
              </List.Item>
              <List.Item as={Link} to='/privacy' rel='noopener noreferrer'>
                Privacy Policy
              </List.Item>
              <List.Item as='a' href='mailto:quackprep@gmail.com'>
                quackprep@gmail.com
              </List.Item>
            </List>
            <p style={{ marginTop: '1em' }}>© {currentYear} QuackPrep. All rights reserved.</p>
          </Container>
        </Segment>
      </Container>
    </Segment>
  );
}
