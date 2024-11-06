import { Card, Icon } from 'semantic-ui-react';
export default function PlusIconCard({ onClick, Title }) {
  return (
    <Card
      style={{
        width: '150px', // Set your desired square size
        height: '150px', // Match height to width to make it square
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClick}
    >
      {Title}
      <Icon name='plus' size='large' />
    </Card>
  );
}
