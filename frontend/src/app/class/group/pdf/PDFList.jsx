import { changeNavbarPage, selectNavbarState } from '@app/layout/navbar/navbarSlice.js';
import { selectBINARYArrayOfStateById } from 'maddox-js-funcs';
import { useDispatch, useSelector } from 'react-redux';
import { Segment, Header, Icon, Grid, Button, Container, Dimmer } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { selectLoadingState } from '@app/store/loadingSlice.js';
import NoItemsFound from '@components/NoItemsFound';

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
          <strong>We are moving away from pdfs soon, but all the content will stay.</strong>
        </Header.Content>
      </Header>

      <Grid columns={5} stackable>
        {pdfs?.map((pdf, index) => (
          <Grid.Column key={index}>
            <Segment>
              <Header as='h4' textAlign='center'>
                {pdf.name}
              </Header>
              <Button
                primary
                fluid
                compact
                onClick={() => {
                  if (pdf?.id) {
                    dispatch(changeNavbarPage(navigate, pdf.id));
                  } else {
                    console.log('fatal error');
                  }
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
        {pdfs?.length === 0 && <NoItemsFound />}
      </Grid>
    </Segment>
  );
}
