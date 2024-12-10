import { useState } from 'react';
import { Modal, Icon, Button, Segment, Header } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import CreateInputForm from '@components/CreateInputForm';
import { postQuestionReport } from '../questionSlice';
import './questionReport.css';

export default function QuestionReport({ questionId }) {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = ({ text }) => {
    dispatch(postQuestionReport(questionId, text));
    setIsModalOpen(false);
  };

  return (
    <>
      <Button icon className='report' color='red' onClick={() => setIsModalOpen(true)}>
        <Icon name='flag' />
      </Button>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} closeIcon size='small'>
        <Modal.Header>Report Question {questionId}</Modal.Header>
        <Modal.Content>
          <Segment basic>
            <Header as='h4' color='red'>
              Please tell us why you are reporting this question:
            </Header>
            <CreateInputForm
              title=''
              formFields={[
                {
                  name: 'text',
                  value: '',
                  required: true,
                  placeholder: 'Describe the issue here...',
                },
              ]}
              onSubmit={handleSubmit}
            />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
