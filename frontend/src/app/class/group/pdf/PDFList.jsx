import { changeNavbarPage, selectNavbarState } from '@components/navbar/navbarSlice.js';
import { selectBINARYArrayOfStateById } from '@utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { Segment, Header, Icon, Grid, Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { selectLoadingState } from '@src/app/store/loadingSlice.js';

// have pdfs do its own dispatches unlike the rest of my shitty app
// no one needs to access pdfs stuff so it wont be in redux like all my other stuff
export default function PDFList() {
  const navigate = useNavigate();
  const { classId } = useSelector(selectNavbarState).navbar;
  const loading = useSelector(selectLoadingState).loadingComps?.PDFList;
  const pdfs = useSelector(selectBINARYArrayOfStateById('app.pdf.pdfs', 'class_id', classId));
  const dispatch = useDispatch();

  return (
    <Segment loading={loading}>
      <Header as='h3'>
        <Icon name='file pdf' />
        <Header.Content>
          PDF Exams
          <Header.Subheader>{pdfs?.length} available</Header.Subheader>
        </Header.Content>
      </Header>

      <Grid columns={3} stackable>
        {pdfs?.map((pdf, index) => (
          <Grid.Column key={index} style={{ paddingBottom: '100%' }}>
            <Segment>
              <Header as='h4' textAlign='center'>
                {pdf.name}
              </Header>
              <Button
                primary
                fluid
                compact
                onClick={() => {
                  dispatch(changeNavbarPage(navigate, pdf.id));
                }}
                icon
                labelPosition='left'
                style={{ marginTop: '0.5em' }}
              >
                <Icon name='file pdf' />
                View PDF
              </Button>
            </Segment>
          </Grid.Column>
        ))}
      </Grid>
    </Segment>
  );
}
