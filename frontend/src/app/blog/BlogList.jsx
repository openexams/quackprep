// list of blogs
import { Header, Segment, Grid, Card, Image } from 'semantic-ui-react';
import { blogs } from './blogs';
import { useNavigate } from 'react-router-dom';
import { changeNavbarPage } from '@app/layout/navbar/navbarSlice';

export default function BlogMain() {
  const navigate = useNavigate();
  return (
    <Segment basic style={{ padding: '4em 0' }}>
      <Header as='h1' textAlign='center' style={{ marginBottom: '2rem', fontSize: '2.5em' }}>
        Helpful Articles
      </Header>

      <Grid columns={2} stackable centered>
        {blogs.map((blog) => (
          <Grid.Column style={{ maxWidth: '25em', maxHeight: '25em' }} key={blog.getLink()}>
            <Card
              style={{ width: '25em', height: '25em' }}
              as='a'
              onClick={() => changeNavbarPage(navigate, `/blog/${blog.getLink()}`, { scrollToTop: true })}
              size='small'
              key={blog.getLink()}
            >
              {/* Blog Image at the top */}
              <Image src={blog.getIcon()} fluid />

              {/* Publication Date */}
              <p style={{ marginTop: '1em', color: 'grey', fontSize: '0.9em', padding: '0em .5em' }}>
                Published On: {blog.getPubDate().toLocaleDateString()}
              </p>

              {/* Blog Title */}
              <Header as='h2' style={{ marginBottom: '0.5em', marginTop: '-.5em', padding: '0em .5em' }}>
                {blog.getTitle()}
              </Header>
            </Card>
          </Grid.Column>
        ))}
      </Grid>
    </Segment>
  );
}
