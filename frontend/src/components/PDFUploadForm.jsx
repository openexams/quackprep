import { useRef, useState } from 'react';
import { Form, Button, Icon, List, Message } from 'semantic-ui-react';
import { MAX_FILE_SIZE_IN_BYTES } from '../../../constants.js';

const PdfUploadForm = ({ onSubmit }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null); // State to handle error messages
  const fileInputRef = useRef(null);

  // Maximum file size in bytes (4MB)

  // Handle traditional file picking
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      validateFiles(newFiles);
    }
  };
  const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

  /**
   * @param {File[]} newFiles
   */
  const validateFiles = (newFiles) => {
    const validFiles = [];
    const invalidFiles = [];

    newFiles.forEach((file) => {
      if (file.size <= MAX_FILE_SIZE_IN_BYTES && allowedFileTypes.includes(file.type)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setError(
        `The following files exceed the ${MAX_FILE_SIZE_IN_BYTES} bytes limit or werent the correct type: ${invalidFiles.join(
          ', ',
        )}`,
      );
    } else {
      setError(null);
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
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
      validateFiles(newFiles);
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
    setError(null);
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
            {isDragging ? 'Drop your PDF/Image here...' : `Click HERE or Drag & Drop your PDF/Image files`}
          </p>
        </div>
        {/* Hidden input for picking files traditionally */}
        <input
          ref={fileInputRef}
          id='file'
          type='file'
          accept={allowedFileTypes.join(',')}
          hidden
          multiple
          onChange={handleFileChange}
        />

        {/* Display error message if any */}
        {error && (
          <Message negative style={{ marginTop: '1rem' }}>
            <Message.Header>File Size Error</Message.Header>
            <p>{error}</p>
          </Message>
        )}

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
          <Icon name='upload' /> Submit
        </Button>
      </Form>
    </div>
  );
};

export default PdfUploadForm;
