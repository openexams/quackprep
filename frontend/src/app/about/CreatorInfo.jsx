import { Card, Image, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const CreatorInfo = ({ imgSrc, name, description, links }) => {
  return (
    <Card
      fluid
      style={{
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        maxWidth: '350px',
        margin: 'auto',
      }}
    >
      {/* Remove the extra div wrapper around Image */}
      <Image
        src={imgSrc}
        wrapped={false} // Changed to false to remove extra padding
        ui={false}
        style={{
          objectFit: 'cover',
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px',
          display: 'flex', // Ensures no extra space
        }}
      />
      <Card.Content>
        <Card.Header style={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center' }}>{name}</Card.Header>
        <Card.Description style={{ fontSize: '1rem', color: '#666', marginTop: '10px', textAlign: 'center' }}>
          {description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {links.map((link, index) => (
            <Button
              key={index}
              color={link.color || 'blue'}
              as='a'
              href={link.url}
              target='_blank'
              rel='noopener noreferrer'
              style={{ borderRadius: '10px' }}
            >
              <Icon name={link.icon} /> {link.label}
            </Button>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
};

CreatorInfo.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      color: PropTypes.string,
    }),
  ).isRequired,
};

export default CreatorInfo;
