import { Header, Segment } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { selectBINARYArrayOfStateById } from '@utils/functions';
import { useSelector } from 'react-redux';

export default function PDFView() {
  const { pdf_id } = useParams();
  const pdf = useSelector(selectBINARYArrayOfStateById('app.pdf.pdfs', 'id', pdf_id))?.[0];
  const segmentStyle = {
    height: 'calc(100vh - 10rem)',
    display: 'flex',
    flexDirection: 'column',
    margin: '1rem',
  };
  return (
    //TODO fullscreen button
    <>
      {pdf && (
        <Segment basic placeholder textAlign='center' style={segmentStyle}>
          <Header>{pdf.name}</Header>
          <iframe src={pdf.link} width='100%' height='100%' title='PDF Viewer' />
        </Segment>
      )}
    </>
  );
}
