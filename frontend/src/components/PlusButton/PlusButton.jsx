import { Button, Icon, Popup } from 'semantic-ui-react';
import './PlusButton.css';
import { selectUser } from '@app/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { changeNavbarPage } from '@app/layout/navbar/navbarSlice';
import { useNavigate } from 'react-router-dom';
import { show401Msg } from '@components/401/401Slice';

const PlusButton = ({ onClick, className, popupText, popupPosition = 'top center', ...props }) => {
  const user_id = useSelector(selectUser).user?.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <Popup
      trigger={
        <Button
          className={`pulse-plus-button compact-plus-button ${className}`}
          onClick={() => {
            if (!user_id) {
              dispatch(show401Msg());
            } else {
              onClick();
            }
          }}
          {...props}
        >
          Create
          <Icon name='plus' />
        </Button>
      }
      content={popupText || null}
      position={popupPosition}
      basic
    />
  );
};

export default PlusButton;
