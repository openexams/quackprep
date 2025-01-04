import { useState } from 'react';
import { List, Icon, Modal, Button, Label, Segment } from 'semantic-ui-react';
import { generateQuestionLike } from './aiQuestionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@src/app/auth/authSlice';
import LoginRequired from '@src/app/auth/LoginRequired';
import { selectLoadingState } from '@src/app/store/loadingSlice';

export default function GenerateQuestion() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector(selectUser).user;
  const loading = useSelector(selectLoadingState).loadingComps?.GenerateQuestion;

  return (
    <>
      <List.Item onClick={() => setIsOpen(true)} style={{ cursor: 'pointer' }}>
        <List.Header as='h4' style={{ margin: 0, display: 'flex' }}>
          Generate New Question 🤖 <Label size='mini' color='blue' content={'AI'} />
        </List.Header>
      </List.Item>

      <Modal closeIcon open={isOpen} onClose={() => setIsOpen(false)} size='small' centered={false}>
        {!user?.id ? (
          <LoginRequired title={'Generative AI'} />
        ) : (
          <>
            <Modal.Header>Generate a Similar Question</Modal.Header>
            <Modal.Content>
              <Segment basic loading={loading}>
                Click "Generate" to create a new question similar to the one you just answered. This will help improve your
                learning experience!
              </Segment>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => setIsOpen(false)} color='red'>
                <Icon name='cancel' /> {!loading ? 'Cancel' : 'Close'}
              </Button>
              {!loading && (
                <Button onClick={() => dispatch(generateQuestionLike(64, 'test for you!'))} color='green'>
                  <Icon name='checkmark' /> Generate
                </Button>
              )}
            </Modal.Actions>
          </>
        )}
      </Modal>
    </>
  );
}
