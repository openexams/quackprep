import { useState, useEffect } from 'react';
import { Button, Image, Popup } from 'semantic-ui-react';
import './widget.css';
import PopupChild from './PopupChild';

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const startAnimation = () => {
      setIsAnimating(true);

      // Stop the animation after it completes
      setTimeout(() => setIsAnimating(false), 2500); // Matches the animation duration
    };

    // Start animation at random intervals (5-10 seconds)
    const interval = setInterval(startAnimation, Math.random() * 5000 + 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const widgetStyles = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '4.5rem',
    height: '4.5rem',
    backgroundColor: 'var(--accent-color) !important',
    borderRadius: '50%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 1000,
  };

  const imageStyles = {
    width: '50px',
    height: '50px',
    position: 'absolute',
    animation: isAnimating ? 'lookAround 2.5s ease-in-out' : 'none',
  };
  return (
    <Popup
      open={open}
      trigger={
        <Button style={widgetStyles} onClick={() => setOpen(!open)}>
          <Image src='/img/quackprep_logo.webp' alt='Chatbot' style={imageStyles} />
        </Button>
      }
    >
      <PopupChild />
    </Popup>
  );
}
