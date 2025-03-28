import { Loader, Dimmer, Image } from 'semantic-ui-react';
import './CustomImageLoader.css';

export function CustomImageLoader({ active, content, imageUrl, children }) {
  return (
    <div style={{ position: 'relative' }}>
      {children}
      {active && (
        <Dimmer active inverted>
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <Image
              src={imageUrl || '/img/quackprep_logo.webp'}
              circular
              className='spinning-image'
              style={{
                width: '150px',
                height: '150px',
                animation: 'spin 2s linear infinite',
              }}
            />
            <Loader
              size='small'
              content={content || 'Loading...'}
              style={{
                minWidth: '15em', // Set a minimum width to prevent wrapping
                // whiteSpace: 'nowrap', // Prevent wrapping of text
              }}
            />
          </div>
        </Dimmer>
      )}
    </div>
  );
}
