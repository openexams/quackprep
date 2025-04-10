import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGroupGivenPDF } from './groupSlice';
import { Button, Input, Header, Popup, Icon } from 'semantic-ui-react';
import PdfUploadForm from '@components/PDFUploadForm';
import { CustomImageLoader } from '@components/CustomLoader/CustomImageLoader';
import { selectLoadingState } from '@app/store/loadingSlice';

export default function CreateGroupByPDF({ classId }) {
  const dispatch = useDispatch();
  const [customPrompt, setCustomPrompt] = useState('');
  const [savePdf, setSavePdf] = useState(false);
  const loading = useSelector(selectLoadingState).loadingComps.CreateGroupByPDF;

  function handlePdfSubmit(formData) {
    if (classId) {
      dispatch(createGroupGivenPDF(formData, classId, customPrompt || null, savePdf));
      setCustomPrompt('');
    } else {
      window.alert('Please select a class first');
    }
  }

  // Popup content for AI generation info
  const aiGenerationInfoContent = (
    <div>
      <p>
        <strong>Processing Time:</strong> The longer the PDF, the more time it will take to process. (Sometimes up to ~10min)
      </p>
      <p>
        <strong>AI Capabilities:</strong> AI can summarize, extract key points, and generate study materials. However, it is NOT
        perfect.
      </p>
      <p>
        <strong>Custom Prompt Tip:</strong> Use a custom prompt to guide the AI for specific outputs.
      </p>
      <p>
        <strong>Accuracy Tip:</strong> Give it the correct answers, if not, it may generate incorrect information.
      </p>
    </div>
  );

  return (
    <CustomImageLoader
      content={`Wait here or come back in a bit. Magic takes time! We will email you when it's ready.`}
      active={loading}
    >
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <Header as='h1' textAlign='center'>
          Upload Past Exams
        </Header>
        <Header.Subheader>
          For the best results please send the ai the answers or answer key. If not available, it will try to solve them.
        </Header.Subheader>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <input
              type='checkbox'
              id='savePdfCheckbox'
              checked={savePdf}
              onChange={(e) => setSavePdf(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            <label htmlFor='savePdfCheckbox' style={{ fontWeight: 'bold', margin: 0 }}>
              Save PDF to S3?{' '}
              <Popup
                content='This will save the PDF to the server and link it to the group to show to everyone.'
                trigger={<Icon name='info circle' color='blue' />}
              />
            </label>
          </div>
          <label style={{ fontWeight: 'bold' }}>
            Custom Prompt{' '}
            <Popup
              content='Example: This Exam is about calc 3 and the answers are given in a seperate document.'
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
        {/* Popup for AI generation info */}
        <div style={{ marginBottom: '1rem' }}>
          <Popup
            content={aiGenerationInfoContent}
            trigger={
              <Button icon labelPosition='left' color='blue'>
                <Icon name='info' />
                AI Generation Info
              </Button>
            }
            wide
            hoverable
          />
        </div>
        <PdfUploadForm onSubmit={handlePdfSubmit} />
      </div>
    </CustomImageLoader>
  );
}
