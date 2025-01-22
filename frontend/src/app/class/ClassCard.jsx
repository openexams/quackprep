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

export default function ClassCard({ id, name, category, desc, school_id, created_by }) {
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

  // If in edit mode, show the editor instead
  if (edit) {
    return <ClassEditor id={id} name={name} category={category} desc={desc} school_id={school_id} />;
  }

  // Example quadrant click handlers
  const handleStudyGroup = (e) => {
    e.stopPropagation();
    alert('Study by Group clicked!');
  };
  const handleEdit = (e) => {
    e.stopPropagation();
    alert('Edit clicked!');
  };
  const handleBookmark = (e) => {
    e.stopPropagation();
    alert('Bookmark clicked!');
  };
  const handleShare = (e) => {
    e.stopPropagation();
    alert('Share clicked!');
  };

  // Common styling for quadrants
  const quadrantStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease',
    // Slight "pop" on hover for each quadrant (optional)
    cursor: 'pointer',
  };

  return (
    <div
      style={{
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // onClick={() => {
      //   dispatch(updateCurrentClassData(id, name));
      // }}
    >
      {/* Card Container */}
      <Card
        color={cardColor}
        style={{
          position: 'relative',
          overflow: 'hidden',
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <Card.Content>
          <Icon name={icon} size='large' />
          <Card.Header>{name}</Card.Header>
          <Card.Meta>Level: {level}</Card.Meta>
          <Card.Description>{desc}</Card.Description>
        </Card.Content>

        {/* 
          2×2 Overlay with Title
          - Only visible on hover
          - Using CSS Grid for quadrants
        */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // Fade in/out
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Quadrants Container */}
          <div
            style={{
              display: 'grid',
              flex: 1,
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              background: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Quadrant 1: Study Group */}
            <div
              onClick={() => dispatch(changeNavbarPage(navigate, `${id}/group?type=topic`))}
              style={{
                ...quadrantStyle,
                borderRight: '1px solid #fff',
                borderBottom: '1px solid #fff',
              }}
            >
              <Icon name='users' size='large' color='blue' style={{ pointerEvents: 'none' }} />
              <div style={{ marginTop: '0.3em', pointerEvents: 'none', color: '#fff' }}>Study By Topic</div>
            </div>

            {/* Quadrant 2: Edit */}
            <div
              onClick={() => dispatch(changeNavbarPage(navigate, `${id}/group?type=topic`))}
              style={{
                ...quadrantStyle,
                borderBottom: '1px solid #fff',
              }}
            >
              <Icon name='book' size='large' color='green' style={{ pointerEvents: 'none' }} />
              <div style={{ marginTop: '0.3em', pointerEvents: 'none', color: '#fff' }}>Study By Exam</div>
            </div>

            {/* Quadrant 3: Bookmark*/}
            <div
              onClick={() => dispatch(changeNavbarPage(navigate, `/learn`))}
              style={{
                ...quadrantStyle,
                borderRight: '1px solid #fff',
              }}
            >
              <Icon name='bookmark' size='large' color='orange' style={{ pointerEvents: 'none' }} />
              <div style={{ marginTop: '0.3em', pointerEvents: 'none', color: '#fff' }}>Ai Learn</div>
            </div>
            {/*

            Quadrant 4: Share 
            <div onClick={handleShare} style={quadrantStyle}>
              <Icon name='share alternate' size='large' color='red' style={{ pointerEvents: 'none' }} />
              <div style={{ marginTop: '0.3em', pointerEvents: 'none', color: '#fff' }}>Share</div>
            </div>*/}
          </div>
        </div>
      </Card>
    </div>
  );
}
