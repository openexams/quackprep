import { useSelector } from 'react-redux';
import { selectNavbarState } from '../layout/navbarSlice';
import { Message, Button } from 'semantic-ui-react';
import { useState } from 'react';
import MarkdownRenderer from '@components/MarkdownRenderer';

export default function Announcement() {
  const announcement = useSelector(selectNavbarState).navbar?.announcement;
  const [isVisible, setIsVisible] = useState(true);

  if (!announcement || !isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <Message
      color='blue'
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderRadius: 0,
        margin: 0,
        padding: '1em 2em',
        color: 'black', // ensure text is black
      }}
    >
      <Message.Content
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'inherit', // use the same color for the content
        }}
      >
        <div
          style={{
            fontSize: '1.1em',
            fontWeight: 'bold',
            color: 'inherit', // again, inherit black
          }}
        >
          <MarkdownRenderer allowLinks={true} render={announcement} />
        </div>
        <Button
          icon='close'
          onClick={handleDismiss}
          basic
          style={{
            marginLeft: '1em',
            boxShadow: 'none',
          }}
        />
      </Message.Content>
    </Message>
  );
}
