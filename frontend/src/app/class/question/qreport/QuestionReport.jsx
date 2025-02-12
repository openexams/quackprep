import { useState } from 'react';
import { Modal, Icon, Button, Segment, Header } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import CreateInputForm from '@components/CreateInputForm';
import { postQuestionReport } from '../questionSlice';
import './questionReport.css';
import { selectUser } from '@app/auth/authSlice';
import LoginRequired from '@app/auth/LoginRequired';

export default function QuestionReport({ questionId }) {
  const user_id = useSelector(selectUser).user?.id;
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = ({ text }) => {
    dispatch(postQuestionReport(questionId, text));
    setIsModalOpen(false);
  };

  return (
    <Segment basic>
      <Button icon className='report' color='red' onClick={() => setIsModalOpen(true)}>
        <Icon name='flag' />
      </Button>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} closeIcon size='small'>
        <Modal.Header>Report Question {questionId}</Modal.Header>
        <Modal.Content>
          {user_id ? (
            <Segment basic>
              <Header as='h4' color='red'>
                Please tell us why you are reporting this question:
              </Header>
              <CreateInputForm
                formFields={[
                  {
                    name: 'text',
                    value: '',
                    required: true,
                  },
                ]}
                onSubmit={handleSubmit}
              />
            </Segment>
          ) : (
            <LoginRequired title='Report A Question' />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    </Segment>
  );
}
