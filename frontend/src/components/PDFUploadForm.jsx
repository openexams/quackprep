import { useEffect, useRef, useState } from 'react';
import { Form, Button, Icon, List } from 'semantic-ui-react';

const PdfUploadForm = ({ onSubmit }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [count, setCount] = useState(0);
  const fileInputRef = useRef(null);

  // Handle traditional file picking
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  // Programmatically open the hidden file input
  const handleChooseFilesClick = () => {
    fileInputRef.current.click();
  };

  // Remove file at a given index
  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      // Clear the drag data
      e.dataTransfer.clearData();
    }
  };

  /**
   * Reset the component to its initial state
   */
  function resetComponent() {
    setFiles([]);
    setIsDragging(false);
    setCount((prevCount) => prevCount + 1);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      onSubmit(formData);
      resetComponent();
    } else {
      window.alert('No files selected');
    }
  };

  return (
    <div key={`ai-group-create-${count}`} style={{ margin: '2rem auto' }}>
      <Form onSubmit={handleSubmit}>
        {/* Drag-and-drop area */}
        <div
          style={{
            border: '2px dashed #ccc',
            borderRadius: '5px',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: isDragging ? '#eee' : '#fff',
            transition: 'background-color 0.2s ease',
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleChooseFilesClick} // Also allow click to choose
        >
          <Icon name='file pdf outline' size='huge' />
          <p style={{ marginTop: '1rem' }}>
            {isDragging ? 'Drop your PDF/Image here...' : 'Drag & Drop your PDF/Image files here or click to select'}
          </p>
        </div>
        {/* Hidden input for picking files traditionally */}
        <input
          ref={fileInputRef}
          id='file'
          type='file'
          accept='application/pdf, image/jpeg, image/png, image/jpg'
          hidden
          multiple
          onChange={handleFileChange}
        />

        {/* Display the list of selected files */}
        {files.length > 0 && (
          <List divided style={{ marginTop: '1rem' }}>
            {files.map((file, index) => (
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

        <Button type='submit' color='blue' style={{ marginTop: '1rem' }}>
          <Icon name='upload' /> Upload
        </Button>
      </Form>
    </div>
  );
};

export default PdfUploadForm;
