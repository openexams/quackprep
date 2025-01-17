import MarkdownRenderer from '@components/MarkdownRenderer';
import { useState, useRef, useEffect } from 'react';
import { Form, Segment, Popup } from 'semantic-ui-react';

export default function MarkdownEditor({ label, onChange, value, placeholder, required }) {
  const [editingMD, setEditingMD] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        setEditingMD(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Popup
      content={editingMD ? 'Click outside to render md' : 'Click to edit'}
      trigger={
        <Segment
          ref={editorRef}
          onClick={() => {
            setEditingMD(true);
          }}
        >
          {`${label}:`}
          {!editingMD ? (
            <div>
              <MarkdownRenderer render={value} />
            </div>
          ) : (
            <Form.TextArea
              label={label}
              required={required}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              autoFocus
            />
          )}
        </Segment>
      }
    />
  );
}
