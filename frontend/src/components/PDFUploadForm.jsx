import { useRef, useState } from 'react';
import { Button, Icon, List, Message, Segment } from 'semantic-ui-react';
import { MAX_FILE_SIZE_IN_BYTES, ALLOWED_FILE_TYPES, MAX_FILES_UPLOAD } from '../../../constants.js';

const PdfUploadForm = ({ onSubmit, showImages = true, buttonText = 'Submit' }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  /**
   *
   * @param {Object[]} files
   */
  function takeFiles(arrFiles) {
    if (files.length + arrFiles.length > MAX_FILES_UPLOAD) {
      setError(
        `MAX ${MAX_FILES_UPLOAD} FILES, if you really need to do more combine them or contact me i'd be willing to change the limit.`,
      );
    } else {
      validateFiles(arrFiles);
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      takeFiles(Array.from(e.target.files));
    }
  };

  const validateFiles = (newFiles) => {
    setError(null);
    const validFiles = [];
    const invalidFiles = [];

    newFiles.forEach((file) => {
      if (file.size <= MAX_FILE_SIZE_IN_BYTES && ALLOWED_FILE_TYPES.includes(file.type)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setError(
        `The following files exceed the ${MAX_FILE_SIZE_IN_BYTES} bytes limit or weren't the correct type: ${invalidFiles.join(
          ', ',
        )}`,
      );
    } else {
      setError(null);
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleChooseFilesClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

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
      takeFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  const resetComponent = () => {
    setFiles([]);
    setIsDragging(false);
    setCount((prevCount) => prevCount + 1);
    setError(null);
  };

  const handleSubmit = () => {
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
    <Segment
      placeholder
      raised
      style={{
        background: 'linear-gradient(145deg, #f6f8fa 0%, #eef2f6 100%)',
        border: '2px dashed #ccd6e0',
        padding: '3rem 2rem',
        marginTop: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleChooseFilesClick}
    >
      <div key={`ai-group-create-${count}`} style={{ margin: '2rem auto' }}>
        <div
          style={{
            border: '2px dashed #ccc',
            borderRadius: '5px',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: isDragging ? '#eee' : '#fff',
            transition: 'background-color 0.2s ease',
          }}
        >
          <Icon name='file pdf outline' size='huge' />
          <p style={{ marginTop: '1rem' }}>
            {isDragging ? 'Drop your PDF/Image here...' : `Click HERE or Drag & Drop your PDF/Image files`}
          </p>
        </div>
        <input
          ref={fileInputRef}
          id='file'
          type='file'
          accept={ALLOWED_FILE_TYPES.join(',')}
          hidden
          multiple
          onChange={handleFileInput}
        />
        {error && (
          <Message negative style={{ marginTop: '1rem' }}>
            <Message.Header>File Error</Message.Header>
            <p>{error}</p>
          </Message>
        )}
        {files.length > 0 && (
          <List divided style={{ marginTop: '1rem' }}>
            {files.map((file, index) => (
              <List.Item key={index}>
                <List.Content floated='right'>
                  <Button icon='trash' color='red' onClick={() => handleRemoveFile(index)} />
                </List.Content>
                <List.Icon name='file pdf outline' size='large' verticalAlign='middle' />
                <List.Content>
                  {showImages && file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: '100px', height: 'auto' }} />
                  ) : (
                    file.name
                  )}
                </List.Content>
              </List.Item>
            ))}
          </List>
        )}
        <Button
          type='button'
          color='blue'
          style={{ marginTop: '1rem' }}
          onClick={(e, d) => {
            e.stopPropagation();
            handleSubmit();
          }}
        >
          <Icon name='upload' /> {buttonText}
        </Button>
      </div>
    </Segment>
  );
};

export default PdfUploadForm;
