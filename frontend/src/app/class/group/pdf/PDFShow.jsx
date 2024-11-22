import { Header, Segment } from 'semantic-ui-react';

export default function PDFView({ link, title }) {
  return (
    <Segment>
      <Header>{title}</Header>
      <iframe src={link} />
    </Segment>
  );
}
