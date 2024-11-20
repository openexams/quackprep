import CreateInputForm from '@components/CreateInputForm';
import { useState } from 'react';
import { Modal, Icon, Button, Segment } from 'semantic-ui-react';
import { postQuestionReport } from './questionSlice';
import { useDispatch } from 'react-redux';
import './questionReport.css';

export default function QuestionReport({ questionId }) {
  const dispatch = useDispatch();
  const [report, setReport] = useState(false);
  return (
    <>
      <Button className='report' onClick={() => setReport(true)}>
        <Icon name='flag' />
      </Button>

      <Modal
        open={report}
        onClose={() => {
          setReport(false);
        }}
        closeIcon
      >
        <Segment basic>
          <CreateInputForm
            title={'Report A Question'}
            formFields={[{ name: 'text', value: '', required: true }]}
            onSubmit={({ text }) => {
              dispatch(postQuestionReport(questionId, text));
              setReport(false);
            }}
          />
        </Segment>
      </Modal>
    </>
  );
}
