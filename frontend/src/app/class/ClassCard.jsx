import { changeNavbarPage, updateCurrentClassData } from '@components/navbar/navbarSlice';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Icon } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import ClassEditor from '../creator/editor/ClassEditor';
import { selectCanAndIsEdit } from '../auth/authSlice';

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
    case 4 || 'BIO':
      return 'dna';
    case 5 || 'CHEM':
      return 'flask';
    case 6 || 'PHY':
      return 'rocket';
    case 7 || 'PSY':
      return 'puzzle';
    default:
      return 'beer';
  }
}

export default function ClassCard({ id, name, category, desc, school_id, user_id }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const dispatch = useDispatch();
  const edit = useSelector(selectCanAndIsEdit(user_id));

  const level = useMemo(() => {
    return findClassNumber(name)?.[0];
  }, [name]);

  const icon = useMemo(() => {
    return getIconByCategory(category);
  }, [category]);

  const cardColor = useMemo(() => {
    return getColorByLevel(level);
  }, [level]);

  if (edit) {
    return <ClassEditor id={id} name={name} category={category} desc={desc} school_id={school_id} />;
  }

  return (
    <div
      style={{
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        dispatch(changeNavbarPage(navigate, `${id}`)); // go to certain class
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
    </div>
  );
}
