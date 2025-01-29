import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGroupGivenPDF } from './groupSlice';
import { Button, Input, Header, Popup, Icon, Modal } from 'semantic-ui-react';
import PdfUploadForm from '@components/PDFUploadForm';
import { CustomImageLoader } from '@components/CustomLoader/CustomImageLoader';
import { selectLoadingState } from '@app/store/loadingSlice';

// will only render if user has edit permissions
export default function CreateGroupByPDF({ classId }) {
  const dispatch = useDispatch();
  const [customPrompt, setCustomPrompt] = useState('');
  const loading = useSelector(selectLoadingState).loadingComps.CreateGroupByPDF;

  function handlePdfSubmit(formData) {
    if (classId) {
      dispatch(createGroupGivenPDF(formData, classId, customPrompt || null));
      setCustomPrompt('');
    } else {
      window.alert('Please select a class first');
    }
  }

  // Popup content for AI generation info
  const aiGenerationInfoContent = (
    <div>
      <p>
        <strong>Processing Time:</strong> The longer the PDF, the more time it will take to process. (Sometimes up to ~15min)
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
