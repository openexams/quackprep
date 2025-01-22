import { changeNavbarPage, updateCurrentClassData } from '@components/navbar/navbarSlice';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Icon } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import ClassEditor from '../creator/forms/ClassEditor';
import { selectEditState, selectUser } from '../auth/authSlice';

function findClassNumber(nameOfClass) {
  for (let i = 0; i < nameOfClass.length; i++) {
    if (parseInt(nameOfClass[i])) {
      return nameOfClass.slice(i);
    }
  }
  console.log('Fatal error: no number found in class name? Must include a number e.g. "MA26100"');
  return null;
}

function getColorByLevel(level) {
  const parsed = parseInt(level);
  switch (parsed) {
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

export function getIconByCategory(category) {
  switch (category) {
    case 1:
    case 'CS':
      return 'code';
    case 2:
    case 'MAT':
      return 'cube';
    case 3:
    case 'ECON':
      return 'cog';
    case 4:
    case 'BIO':
      return 'dna';
    case 5:
    case 'CHEM':
      return 'flask';
    case 6:
    case 'PHY':
      return 'rocket';
    case 7:
    case 'PSY':
      return 'puzzle';
    default:
      return 'beer';
  }
}

export default function ClassCard({ id, name, category, desc, school_id, created_by, created_username }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const dispatch = useDispatch();
  const editMode = useSelector(selectEditState);
  const currentUserId = useSelector(selectUser).user?.id;
  const isOwner = currentUserId === parseInt(created_by);
  const edit = isOwner && editMode;

  // Extract level from class name
  const level = useMemo(() => findClassNumber(name)?.[0], [name]);

  // Icons & color
  const icon = useMemo(() => getIconByCategory(category), [category]);
  const cardColor = useMemo(() => getColorByLevel(level), [level]);

  if (edit) {
    return <ClassEditor id={id} name={name} category={category} desc={desc} school_id={school_id} />;
  }

  // Common styling for quadrants
  const quadrantStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
  };

  // Text style to improve readability
  const quadrantTextStyle = {
    marginTop: '0.3em',
    pointerEvents: 'none',
    color: '#fff',
    fontSize: '1.1rem', // Larger font
    fontWeight: 600, // Slightly bold
    textShadow: '0 0 5px #000', // A soft shadow around the text
  };

  return (
    <div
      style={{
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
        color={cardColor}
        style={{
          minWidth: '10rem',
          position: 'relative',
          overflow: 'hidden',
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <Card.Content>
          <Icon name={icon} size='large' />
          <Card.Header>{name}</Card.Header>
          <Card.Meta>Created By: {created_username}</Card.Meta>
          <Card.Description>{desc}</Card.Description>
        </Card.Content>

        {/* Hover Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/*
            We use a 2×1 grid on top, and 1×1 (spanning 2 columns) on bottom:
            
              [ Q1 ] [ Q2 ]
              [    Q3    ]
          */}
          <div
            style={{
              display: 'grid',
              flex: 1,
              gridTemplateColumns: '1fr 1fr',
              // Make both rows the same height
              gridTemplateRows: '1fr .8fr',
              // Darken the overlay to add more contrast:
              background: 'rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Quadrant 1: Study By Topic */}
            <div
              onClick={() => dispatch(changeNavbarPage(navigate, `${id}/group?type=topic`))}
              style={{
                ...quadrantStyle,
                borderRight: '1px solid #fff',
                borderBottom: '1px solid #fff',
              }}
            >
              <Icon name='users' size='large' color='blue' style={{ pointerEvents: 'none' }} />
              <div style={quadrantTextStyle}>Study By Topic</div>
            </div>

            {/* Quadrant 2: Study By Exam */}
            <div
              onClick={() => dispatch(changeNavbarPage(navigate, `${id}/group?type=exam`))}
              style={{
                ...quadrantStyle,
                borderBottom: '1px solid #fff',
              }}
            >
              <Icon name='book' size='large' color='green' style={{ pointerEvents: 'none' }} />
              <div style={quadrantTextStyle}>Study By Exam</div>
            </div>

            {/* Bottom Row (spanning both columns): Ai Learn */}
            <div
              onClick={() => dispatch(changeNavbarPage(navigate, `${id}/learn`))}
              style={{
                ...quadrantStyle,
                gridColumn: '1 / span 2',
                borderTop: '1px solid #fff',
              }}
            >
              <Icon name='plug' size='large' color='orange' style={{ pointerEvents: 'none' }} />
              <div style={quadrantTextStyle}>Ai Learn</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
