import React, { useState } from 'react';
import { Card, Icon } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeNavbarPage, getStartedNow, toggleEdit } from '@app/layout/navbar/navbarSlice';
import '../class_card.css';
import useIsMobile from '@utils/hooks/useIsMobile';

export default function ClassCardCTA() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(false);

  // Simple mobile check for whether we trigger hover on card
  const isMobile = useIsMobile();

  return (
    <div
      // Hover scale on desktop; click toggles on mobile
      onMouseEnter={!isMobile ? () => setHovered(true) : undefined}
      onMouseLeave={!isMobile ? () => setHovered(false) : undefined}
      onClick={isMobile ? () => setHovered((prev) => !prev) : undefined}
    >
      <Card
        className='class_card pulseAnimation'
        color='blue'
        style={{
          minWidth: '10rem',
          position: 'relative',
          overflow: 'hidden',
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 0.3s ease, boxShadow 0.3s ease',
        }}
        onClick={() => {
          dispatch(getStartedNow(navigate));
        }}
      >
        <Card.Content>
          <Card.Header style={{ marginTop: '1em' }}>Don't See a Class?</Card.Header>
          <Card.Meta>Create your own and start teaching today!</Card.Meta>

          <Icon
            name='plus circle'
            size='huge'
            color='blue'
            style={{
              animation: hovered ? 'pulse 1.1s ease-in-out infinite' : 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </Card.Content>
      </Card>
    </div>
  );
}
