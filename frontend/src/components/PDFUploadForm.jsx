import { useState } from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';

const PdfUploadForm = ({ onSubmit }) => {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (pdfFile) {
      const formData = new FormData();
      formData.append('file', pdfFile);
      onSubmit(formData);
    } else {
      window.alert('No file selected');
    }
    setPdfFile(null);
  };

  return (
    // comp does not reset on upload
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <Form onSubmit={handleSubmit}>
        <Form.Field required={true}>
          <label>Upload PDF</label>
          {/* 
            Hiding the default input and styling with a Button 
            allows for a more custom, sleek look.
          */}
          <Button as='label' htmlFor='file' type='button' animated='fade' color='teal'>
            <Button.Content visible>
              <Icon name='file pdf outline' /> Choose a PDF
            </Button.Content>
            <Button.Content hidden>Browse</Button.Content>
          </Button>
          <input id='file' type='file' accept='application/pdf' hidden onChange={handleFileChange} />
          {/* Display the selected file name */}
          {pdfFile && <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>Selected File: {pdfFile.name}</p>}
        </Form.Field>

        <Button type='submit' color='blue' disabled={!pdfFile}>
          <Icon name='upload' /> Upload
        </Button>
      </Form>
    </div>
  );
};

export default PdfUploadForm;
