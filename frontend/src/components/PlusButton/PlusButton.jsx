import { Button, Popup } from 'semantic-ui-react';
import './PlusButton.css';
import { selectUser } from '@src/app/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { changeNavbarPage } from '@components/navbar/navbarSlice';
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
          icon='plus'
          onClick={() => {
            if (!user_id) {
              dispatch(show401Msg());
            } else {
              onClick();
            }
          }}
          {...props}
        />
      }
      content={popupText || null}
      position={popupPosition}
      basic
    />
  );
};

export default PlusButton;
