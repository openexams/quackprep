import React from 'react';
import { Loader, Segment, Dimmer, Image } from 'semantic-ui-react';
import './CustomImageLoader.css';

export function CustomImageLoader({ active, content, imageUrl, children }) {
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {children}
      {active && (
        <Dimmer active inverted>
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <Image
              src={imageUrl || '/public/img/quackprep_logo.webp'}
              circular
              className='spinning-image'
              style={{
                width: '150px',
                height: '150px',
                animation: 'spin 2  s linear infinite',
              }}
            />
            <Loader
              size='small'
              content={content || 'Loading...'}
              style={{
                marginTop: '20px',
              }}
            />
          </div>
        </Dimmer>
      )}
    </div>
  );
}
