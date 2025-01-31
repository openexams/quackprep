import { Segment } from 'semantic-ui-react';

export default function ShowerVideo({ src }) {
  return (
    <Segment basic raised style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '800px', // Add a max-width to control the video size
          width: '100%',
        }}
      >
        <video
          loading='lazy'
          src={src}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>
    </Segment>
  );
}
