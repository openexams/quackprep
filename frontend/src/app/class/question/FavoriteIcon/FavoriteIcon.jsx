import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import './FavoriteIcon.css'; // We'll create this CSS file for animations

const FavoriteIcon = ({ onClick, favorited }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();

    // Trigger animation
    setIsAnimating(true);

    // Dispatch action to update favorites
    onClick();

    // Remove animation class after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <Icon
      name={favorited ? 'star' : 'star outline'}
      color={favorited ? 'yellow' : null}
      onClick={handleClick}
      className={`favorite-icon ${isAnimating ? 'animate-twist-zoom' : ''}`}
    />
  );
};

export default FavoriteIcon;
