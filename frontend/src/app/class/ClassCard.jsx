import { changeNavbarPage, updateCurrentClassData } from '@components/navbar/navbarSlice';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Icon } from 'semantic-ui-react';

/**
 * @param {String} nameOfClass
 */
function findClassNumber(nameOfClass) {
  for (let i = 0; i < nameOfClass.length; i++) {
    if (parseInt(nameOfClass[i])) {
      return nameOfClass.slice(i);
    }
  }
  console.log('fatal error class has no number?? classname must include number MA"26100"');
  return null;
}

function getColorByLevel(level) {
  level = parseInt(level);
  switch (level) {
    case 1:
      return 'red';
    case 2:
      return 'blue';
    case 3:
      return 'yellow';
    case 4:
      return 'olive';
    case 5:
      return 'green';
    default:
      return 'grey';
  }
}

function getIconByCategory(category) {
  switch (
    category // should pull in master table w this but im to lazy
  ) {
    case 1:
      return 'code';
    case 2 || 'MAT':
      return 'cube';
    case 3 || 'ECON':
      return 'cog';
    default:
      return 'beer';
  }
}

export default function ClassCard({ id, name, category, desc }) {
  const [hovered, setHovered] = useState(false);
  const dispatch = useDispatch();

  const level = useMemo(() => {
    return findClassNumber(name)?.[0];
  }, [name]);

  const icon = useMemo(() => {
    return getIconByCategory(category);
  }, [category]);

  const cardColor = useMemo(() => {
    return getColorByLevel(level);
  }, [level]);

  return (
    <div
      style={{
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        dispatch(changeNavbarPage(`${name}`)); // go to certain class
        dispatch(updateCurrentClassData(id, name));
      }}
    >
      <Card
        color={cardColor}
        style={{
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        <Card.Content>
          <Icon name={icon} size='large' />
          <Card.Header>{name}</Card.Header>
          <Card.Meta>Level: {level}</Card.Meta>
          <Card.Description>{desc}</Card.Description>
        </Card.Content>
      </Card>

      {/* {hovered && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '5px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          }}
        >
          Study Now!
        </div>
      )} */}
    </div>
  );
}
