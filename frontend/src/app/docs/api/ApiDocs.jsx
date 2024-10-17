import MarkdownRenderer from '@components/MarkdownRenderer';
import { Container, Segment } from 'semantic-ui-react';

const markdown = `#hello <br> **bold**`;
export default function ApiDocs() {
  // could do a while other site as well.
  return (
    <Container>
      <MarkdownRenderer render={markdown} />
    </Container>
  );
}
