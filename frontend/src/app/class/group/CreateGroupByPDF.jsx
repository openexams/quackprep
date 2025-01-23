import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGroupGivenPDF } from './groupSlice';
import { Button, Input, Header, Popup, Icon, Modal } from 'semantic-ui-react';
import PdfUploadForm from '@components/PDFUploadForm';
import { CustomImageLoader } from '@components/CustomLoader/CustomImageLoader';
import { selectLoadingState } from '@src/app/store/loadingSlice';

// will only render if user has edit permissions
export default function CreateGroupByPDF({ classId }) {
  const dispatch = useDispatch();
  const [customPrompt, setCustomPrompt] = useState('');
  const [reset, setReset] = useState(0);
  const loading = useSelector(selectLoadingState).loadingComps.CreateGroupByPDF;

  function handlePdfSubmit(formData) {
    if (classId) {
      setReset(reset + 1);
      dispatch(createGroupGivenPDF(formData, classId, customPrompt || null));
    } else {
      window.alert('Please select a class first');
    }
  }

  return (
    <CustomImageLoader content={'Wait here or come back in a bit. Magic takes time!'} active={loading}>
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <Header as='h1' textAlign='center'>
          Generate New AI Content
        </Header>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 'bold' }}>
            Custom Prompt{' '}
            <Popup
              content="Examples: 'Summarize the document for a study group', 'Extract key points and questions', 'Generate a lesson plan based on this material'."
              trigger={<Icon name='info circle' color='blue' />}
            />
          </label>
          <Input
            placeholder='Enter your custom prompt'
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            fluid
          />
        </div>
        <PdfUploadForm reset={reset} onSubmit={handlePdfSubmit} />
      </div>
    </CustomImageLoader>
  );
}
