import { useParams } from 'react-router-dom';
import { blogs } from './blogs';
import Blog from './Blog'; // Import the Blog class
import { Segment, Header, Container, Grid, Image, Divider, Icon } from 'semantic-ui-react';

export default function BlogShow() {
  const { blog_link } = useParams();
  const blog = Blog.getBlogFromLink(blogs, blog_link);

  if (!blog) {
    return (
      <Container textAlign='center' style={{ marginTop: '2em', minHeight: '60vh' }}>
        <Header as='h2' icon>
          <Icon name='frown outline' />
          404 - Blog Not Found
          <Header.Subheader>The blog you are looking for does not exist.</Header.Subheader>
        </Header>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: '2em' }}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as='h1' textAlign='center'>
              {blog.getTitle()}
            </Header>
            {/* <Header as='h3' textAlign='center' color='grey'>
              By {blog.getBy()}
            </Header>
            <Segment basic textAlign='center'>
              <p style={{ color: 'grey', fontSize: '1.1em' }}>Published On: {blog.getPubDate().toLocaleDateString()}</p>
            </Segment> */}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment basic raised padded>
              <Image
                style={{ margin: '0 auto' }}
                src={blog.getIcon()} // Assuming you have a method to get the image URL
                alt={blog.getTitle()}
                size='medium'
                fluid
                rounded
              />
              <Divider hidden />
              <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>{blog.getDesc()}</p>
              <Divider />
              <div style={{ fontSize: '1.1em', lineHeight: '1.8' }}>{blog.getHtml()}</div>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16} textAlign='center'>
            <Segment basic>
              <Icon name='tags' /> Tags: {blog.getTags()?.length > 0 ? blog.getTags().join(', ') : 'No tags'}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
