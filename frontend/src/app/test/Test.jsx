import { selectUser } from '@app/auth/authSlice';
import MarkdownRenderer from '@components/MarkdownRenderer';
import { Segment } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { ADMIN_ACCOUNT_ID } from '../../../../constants.js';
import { useNavigate } from 'react-router-dom';

export default function Test() {
  const navigate = useNavigate();
  const user_id = useSelector(selectUser).user?.id;
  if (user_id != ADMIN_ACCOUNT_ID) {
    navigate('/404');
    return null;
  }

  return (
    <Segment>
      <MarkdownRenderer
        render={`![alt](https://cdn.mathpix.com/cropped/2025_02_01_18452226bcbd1c15747bg-1.jpg?height=567&width=627&top_left_y=1904&top_left_x=668)`}
      />
    </Segment>
  );
}
