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

      <Grid columns={3} stackable centered>
        <Grid.Row>
          {blogs.map((blog) => (
            <Card
              style={{ width: '25rem' }}
              as='a'
              onClick={() => changeNavbarPage(navigate, `/blog/${blog.getLink()}`, { scrollToTop: true })}
              size='small'
              key={blog.getLink()}
            >
              {/* Blog Image at the top */}
              <Image src={blog.getIcon()} fluid />

              {/* Publication Date */}
              <p style={{ marginTop: '1em', color: 'grey', fontSize: '0.9em' }}>
                Published On: {blog.getPubDate().toLocaleDateString()}
              </p>

              {/* Blog Title */}
              <Header as='h2' style={{ marginBottom: '0.5em', marginTop: '-.5em' }}>
                {blog.getTitle()}
              </Header>
            </Card>
          ))}
        </Grid.Row>
      </Grid>
    </Segment>
  );
}
