import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGroupGivenPDF } from './groupSlice';
import { Button, Input, Header, Popup, Icon, Modal } from 'semantic-ui-react';
import PdfUploadForm from '@components/PDFUploadForm';

export default function CreateGroupByPDF({ classId }) {
  const dispatch = useDispatch();
  const [customPrompt, setCustomPrompt] = useState('');
  const [file, setFile] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  function handlePdfSubmit(formData) {
    setFile(formData.get('file'));
  }

  const handleFormSubmit = () => {
    if (!file) {
      setShowErrorModal(true);
      return;
    }
    dispatch(createGroupGivenPDF(file, classId, customPrompt || null));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <Header as='h1' textAlign='center' color='teal'>
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
      <PdfUploadForm onSubmit={handlePdfSubmit} />
      <Button color='teal' fluid size='large' onClick={handleFormSubmit}>
        Generate Content
      </Button>

      <Modal open={showErrorModal} onClose={() => setShowErrorModal(false)} size='small'>
        <Header icon='exclamation circle' content='File Missing' />
        <Modal.Content>
          <p>Please upload a PDF file before submitting.</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color='teal' onClick={() => setShowErrorModal(false)}>
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
