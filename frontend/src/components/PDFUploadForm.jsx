import { useEffect, useState } from 'react';
import { Form, Button, Icon, List } from 'semantic-ui-react';

const PdfUploadForm = ({ onSubmit, reset }) => {
  const [pdfFiles, setPdfFiles] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setPdfFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setPdfFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (pdfFiles.length > 0) {
      const formData = new FormData();
      pdfFiles.forEach((file) => formData.append('files', file));
      onSubmit(formData);
    } else {
      window.alert('No files selected');
    }
  };

  useEffect(() => {
    if (reset) {
      setPdfFiles([]);
    }
  }, [reset]);

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Upload PDFs</label>
          <Button as='label' htmlFor='file' type='button' animated='fade' color='teal'>
            <Button.Content visible>
              <Icon name='file pdf outline' /> Choose PDFs
            </Button.Content>
            <Button.Content hidden>Browse</Button.Content>
          </Button>
          <input id='file' type='file' accept='application/pdf' hidden multiple onChange={handleFileChange} />
        </Form.Field>

        {/* Display the list of selected files */}
        {pdfFiles.length > 0 && (
          <List divided style={{ marginTop: '1rem' }}>
            {pdfFiles.map((file, index) => (
              <List.Item key={index}>
                <List.Content floated='right'>
                  <Button icon='trash' color='red' onClick={() => handleRemoveFile(index)} />
                </List.Content>
                <List.Icon name='file pdf outline' size='large' verticalAlign='middle' />
                <List.Content>{file.name}</List.Content>
              </List.Item>
            ))}
          </List>
        )}

        <Button type='submit' color='blue' disabled={pdfFiles.length === 0}>
          <Icon name='upload' /> Upload
        </Button>
      </Form>
    </div>
  );
};

export default PdfUploadForm;
